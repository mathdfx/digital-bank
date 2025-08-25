from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_marshmallow import Marshmallow

jwt = JWTManager()
cors =CORS()
ma = Marshmallow()
