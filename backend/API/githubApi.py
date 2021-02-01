
from flask import redirect
from app import app, data
import requests
from requests_oauthlib.oauth1_auth import Client
from flask_restful import Resource, reqparse


import sys

consumerKey = "c7d15d2078ee6a30d76b"
consumerSecretKey = "20239e2887de5e83479d17c8ae6fb440af515483"

oauth = Client(consumerKey, client_secret=consumerSecretKey)

@app.route('/loginGithub', methods = [ 'GET', 'POST' ])
def loginGithub():
    return redirect('https://github.com/login/oauth/authorize?client_id=' + consumerKey)

def callbackParser():
    parser = reqparse.RequestParser()
    parser.add_argument('code')
    return parser
    
@app.route('/oauthAuthorizedGithub')
def oauthAuthorizedGithub():
    parser = callbackParser()
    args = parser.parse_args()
    res = requests.post(' https://github.com/login/oauth/access_token?code=' + args['code'] + '&client_id=' + consumerKey + '&client_secret=' + consumerSecretKey)
    res_split = res.text.split('&')
    oauth_token = res_split[0].split('=')[1]
    
    
    return {"message": "connected as " + oauth_token}