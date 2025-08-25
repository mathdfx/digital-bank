import os 
  
from dotenv import load_dotenv

basedir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
load_dotenv(os.path.join(basedir, '..', '.env'))

class Config:
    #CHAVES#
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'fallback-secret-key'
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'fallback-jwt-secret-key'
    
    #DB
    DATABASE_FILENAME = 'carteira.db'
    DATABASE = os.path.join(basedir, 'instance', DATABASE_FILENAME)
    
    #REGRAS
    INITIAL_BALANCE_RANGE = (1000.00, 10000.00)
    MINIMUM_TRANSACTION_VALUE = 0.01
    
    #CARTEIRA
    ALLOWED_CURRENCIES = ["BTC", "USD", "EUR", "GBP", "CNY"]
    ASSETS_FOR_API = [f"{asset}-BRL" for asset in ALLOWED_CURRENCIES]
    AWESOMEAPI_URL = f"https://economia.awesomeapi.com.br/last/{','.join(ASSETS_FOR_API)}"
    
class DevelopmentConfig(Config):
    DEBUG = True
    
config_by_name = dict(development=DevelopmentConfig)
    