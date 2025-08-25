from app.extensions import ma
from marshmallow import fields, validate
import re 

def validar_usuario(usuario):
    if not re.match("^[a-zA-Z0-9._-]+$", usuario):
        raise validate.ValidationError("O nome de usuário deve conter apenas letras, números, e os caracteres '.', '_', '-'")

class LoginSchema(ma.Schema):
    usuario = fields.Str(required=True)
    senha = fields.Str(required=True)

class RegistroSchema(ma.Schema):
    usuario = fields.Str(required=True, validate=[
        validate.Length(min=3, error="O usuário deve ter no mínimo 3 caracteres."),
        validar_usuario])
    senha = fields.Str(required=True, validate=validate.Length(min=6, error="A senha deve ter no mínimo 6 caracteres."))