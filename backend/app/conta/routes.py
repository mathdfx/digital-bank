from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import ValidationError

from app.db import get_db
from .schemas import TransferenciaSchema

conta_bp = Blueprint('conta', __name__, url_prefix='/conta')

@conta_bp.route('/saldo', methods=['GET'])
@jwt_required()
def get_saldo():
    usuario = get_jwt_identity()
    db = get_db()
    saldo = db.execute('SELECT saldo FROM contas WHERE usuario = ?', (usuario,)).fetchone()
    return jsonify(saldo=round(saldo['saldo'], 2))

@conta_bp.route('/transferencia', methods=['POST'])
@jwt_required()
def transferir():
    try:
        dados = TransferenciaSchema().load(request.json)
    except ValidationError as err:
        return jsonify(err.messages), 400
    
    remetente = get_jwt_identity()
    destinatario, valor = dados['destinatario'], dados['valor']

    min_val = current_app.config['MINIMUM_TRANSACTION_VALUE']
    if valor < min_val:
        return jsonify(erro=f'O valor mínimo para transferência é R${min_val}.'), 400
    
    if remetente == destinatario:
        return jsonify(erro='Não é possível transferir para si mesmo.'), 400

    db = get_db()
    c_origem = db.execute('SELECT saldo FROM contas WHERE usuario = ?', (remetente,)).fetchone()
    c_destino = db.execute('SELECT usuario FROM contas WHERE usuario = ?', (destinatario,)).fetchone()

    if not c_destino:
        return jsonify(erro='Destinatário não encontrado.'), 404
    if c_origem['saldo'] < valor:
        return jsonify(erro='Saldo insuficiente.'), 400
    
    try:
        db.execute('UPDATE contas SET saldo = saldo - ? WHERE usuario = ?', (valor, remetente))
        db.execute('UPDATE contas SET saldo = saldo + ? WHERE usuario = ?', (valor, destinatario))
        db.execute(
            'INSERT INTO transacoes (remetente, destinatario, valor) VALUES (?, ?, ?)',
            (remetente, destinatario, valor)
        )
        db.commit()
    except Exception as e:
        db.rollback()
        return jsonify(erro=f'Erro interno: {e}'), 500
        
    return jsonify(status='Transferência realizada com sucesso!')