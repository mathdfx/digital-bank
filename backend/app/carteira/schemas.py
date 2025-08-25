from app.extensions import ma
from marshmallow import fields, ValidationError
from flask import current_app

def v_moeda(codigo):
    permitidas = current_app.config['ALLOWED_CURRENCIES']
    if codigo not in permitidas:
        raise ValidationError(f'Moeda {codigo} não é suportada.')

class TransacaoSchema(ma.Schema):
    moeda = fields.Str(required=True, validate=v_moeda)
    valor = fields.Float(required=True)