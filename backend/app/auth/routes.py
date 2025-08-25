import random
from flask import request, jsonify, Blueprint, current_app
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from marshmallow import ValidationError

from app.db import get_db
from .schemas import LoginSchema, RegistroSchema

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        dados = LoginSchema().load(request.json)
    except ValidationError as err:
        return jsonify({'status': 'erro', 'mensagem': err.messages}), 400

    db = get_db()
    user = db.execute('SELECT * FROM contas WHERE usuario = ?', (dados['usuario'],)).fetchone()

    if user and check_password_hash(user['senha'], dados['senha']):
        token = create_access_token(identity=user['usuario'])
        return jsonify({'status': 'sucesso', 'access_token': token})
    
    return jsonify({'status': 'erro', 'mensagem': 'Credenciais inválidas.'}), 401

@auth_bp.route('/register', methods=['POST'])
def register():

    schema = RegistroSchema()
    try:
        validated_data = schema.load(request.json)
    except ValidationError as err:
        return jsonify({'status': 'erro', 'mensagem': err.messages}), 400
    db = get_db()
    if db.execute('SELECT usuario FROM contas WHERE usuario = ?', (validated_data['usuario'],)).fetchone():
        return jsonify(erro='Usuário já existe'), 409
    
    senha_hash = generate_password_hash(validated_data['senha'])
    min_val, max_val = current_app.config['INITIAL_BALANCE_RANGE']
    saldo_inicial = round(random.uniform(min_val, max_val), 2)

    db.execute(
        'INSERT INTO contas (usuario, senha, saldo) VALUES (?, ?, ?)',
        (validated_data['usuario'], senha_hash, saldo_inicial)
    )
    db.commit()

    token = create_access_token(identity=validated_data['usuario'])
    return jsonify({'status': 'sucesso', 'mensagem': 'Conta criada!', 'access_token': token}), 201