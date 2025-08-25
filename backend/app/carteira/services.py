import requests  
from flask import current_app 
from app.db import get_db 

def get_cotacoes():
    try:
        api_url = current_app.config['AWESOMEAPI_URL']
        response = requests.get(api_url, timeout=5)
        response.raise_for_status()
        
        dados = response.json()
        
        cotacoes = {
            key.replace('BRL', ''): float(value['bid'])
            for key, value in dados.items()}
        return cotacoes
    except requests.exceptions.RequestException:
        return None

def comprar(usuario, moeda, valor_brl):
    
    min_val = current_app.config['MINIMUM_TRANSACTION_VALUE']
    if valor_brl < min_val:
        return {'erro': f'O valor mínimo para compra é R${min_val}.'}, 400
    
    db = get_db()
    cotacoes = get_cotacoes()

    if not cotacoes or moeda not in cotacoes:
        return {'erro': 'Serviço de cotações indisponível'}, 503

    conta = db.execute('SELECT saldo FROM contas WHERE usuario = ?', (usuario,)).fetchone()

    if conta['saldo'] < valor_brl:
        return {'erro': 'Saldo insuficiente'}, 400

    preco_unitario = cotacoes[moeda]
    qtd_comprada = valor_brl / preco_unitario

    try:
        db.execute('UPDATE contas SET saldo = saldo - ? WHERE usuario = ?', (valor_brl, usuario))
        db.execute(
            '''
            INSERT INTO ativos (usuario, moeda, quantidade) VALUES (?, ?, ?)
            ON CONFLICT(usuario, moeda) DO UPDATE SET quantidade = quantidade + excluded.quantidade
            ''',
            (usuario, moeda, qtd_comprada)
        )
        db.commit()
    except Exception as e:
        db.rollback() 
        return {'erro': f'Erro interno: {e}'}, 500
        
    return {'status': f'Compra de {qtd_comprada:.8f} {moeda} realizada!'}, 201

def vender(usuario, moeda, qtd_venda):
    db = get_db()
    cotacoes = get_cotacoes()

    if not cotacoes or moeda not in cotacoes:
        return {'erro': 'Serviço de cotações indisponível'}, 503

    ativo = db.execute('SELECT quantidade FROM ativos WHERE usuario = ? AND moeda = ?', (usuario, moeda)).fetchone()

    if not ativo or ativo['quantidade'] < qtd_venda:
        return {'erro': f'Saldo de {moeda} insuficiente'}, 400

    preco_unitario = cotacoes[moeda]
    valor_brl = qtd_venda * preco_unitario
    
    min_val = current_app.config['MINIMUM_TRANSACTION_VALUE']
    if valor_brl < min_val:
        return {'erro': f'O valor da venda (R${valor_brl:.2f}) é menor que o mínimo permitido de R${min_val}.'}, 400

    try:
        db.execute('UPDATE ativos SET quantidade = quantidade - ? WHERE usuario = ? AND moeda = ?', (qtd_venda, usuario, moeda))
        db.execute('UPDATE contas SET saldo = saldo + ? WHERE usuario = ?', (valor_brl, usuario))
        db.execute('DELETE FROM ativos WHERE usuario = ? AND moeda = ? AND quantidade = 0', (usuario, moeda))
        db.commit() 
    except Exception as e:
        db.rollback()
        return {'erro': f'Erro interno: {e}'}, 500

    return {'status': f'Venda realizada! +{round(valor_brl, 2)} BRL creditados.'}, 200