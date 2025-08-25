from app.extensions import ma
from marshmallow import fields

class TransferenciaSchema(ma.Schema):
    destinatario = fields.Str(required=True)
    valor = fields.Float(required=True)