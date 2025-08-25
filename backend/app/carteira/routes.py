from flask import request, jsonify, Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import ValidationError
from app.db import get_db
from .services import get_cotacoes, comprar, vender
from .schemas import TransacaoSchema

carteira_bp = Blueprint('carteira', __name__, url_prefix='/carteira')

@carteira_bp.route('/cotacoes', methods=['GET'])
@jwt_required()
def cotacoes_route():
    """Endpoint que retorna as cotações atuais das moedas."""
    cotacoes = get_cotacoes()
    if cotacoes:
        return jsonify(cotacoes)
    return jsonify(erro='Serviço de cotações indisponível.'), 503

@carteira_bp.route('/saldos', methods=['GET'])
@jwt_required()
def saldos_route():
    """Endpoint que retorna todos os saldos do usuário (BRL e outros ativos)."""
    usuario = get_jwt_identity()
    db = get_db()

    conta = db.execute('SELECT saldo FROM contas WHERE usuario = ?', (usuario,)).fetchone()
    ativos = db.execute('SELECT moeda, quantidade FROM ativos WHERE usuario = ?', (usuario,)).fetchall()
    
    transacoes = db.execute(
        'SELECT remetente, destinatario, valor, data FROM transacoes WHERE remetente = ? OR destinatario = ? ORDER BY data DESC LIMIT 5',
        (usuario, usuario)
    ).fetchall()

    return jsonify({
        'saldo_brl': round(conta['saldo'], 2),
        'ativos': [dict(row) for row in ativos],
        'transacoes': [dict(row) for row in transacoes]
    })

@carteira_bp.route('/comprar', methods=['POST'])
@jwt_required()
def comprar_route():
    """Endpoint para comprar um ativo."""
    try:
        dados = TransacaoSchema().load(request.json)
    except ValidationError as err:
        return jsonify({'status': 'erro', 'mensagem': err.messages}), 400

    usuario = get_jwt_identity()
    resultado, status_code = comprar(usuario, dados['moeda'], dados['valor'])
    return jsonify(resultado), status_code

@carteira_bp.route('/vender', methods=['POST'])
@jwt_required()
def vender_route():
    """Endpoint para vender um ativo."""
    try:
        dados = TransacaoSchema().load(request.json)
    except ValidationError as err:
        return jsonify({'status': 'erro', 'mensagem': err.messages}), 400

    usuario = get_jwt_identity()
    resultado, status_code = vender(usuario, dados['moeda'], dados['valor'])
    return jsonify(resultado), status_code