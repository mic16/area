from app import app
from flask import Flask, request
import json

@app.after_request
def after_request(response):
    body = response.get_data().decode()
    print('%s: %s' % (request.base_url, body))
    return response