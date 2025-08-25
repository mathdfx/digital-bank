import os  

from flask import Flask  
from .config import config_by_name  

def create_app():
    app = Flask(__name__, instance_relative_config=True)
    
    config_name = os.getenv('FLASK_ENV', 'development')
    app.config.from_object(config_by_name[config_name])

    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass 

    from .extensions import jwt, cors, ma
    jwt.init_app(app)
    cors.init_app(app)
    ma.init_app(app)

    from . import db
    db.init_app(app)

    from .auth.routes import auth_bp
    from .conta.routes import conta_bp    
    from .carteira.routes import carteira_bp
    app.register_blueprint(auth_bp)
    app.register_blueprint(conta_bp)    
    app.register_blueprint(carteira_bp)

    return app