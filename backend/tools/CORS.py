from flask import request_finished

def setup_cors_header(sender, response, **extra):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
    response.headers.add('Access-Control-Allow-Headers', '*')

def CORS(app):
    request_finished.connect(setup_cors_header, app)