
from flask import redirect, request
from app import app, data
import requests
from requests_oauthlib.oauth1_auth import Client
from flask_restful import Resource, reqparse
from TokenManager import TokenManager

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
    req_data = request.get_json()
    if (req_data.get("token") == None):
        return ({"error": "no token"})
    if (TokenManager.getTokenUser(req_data.get("token")) == None):
        return ({"error": "bad token"})
    parser = callbackParser()
    args = parser.parse_args()
    res = requests.post(' https://github.com/login/oauth/access_token?code=' + args['code'] + '&client_id=' + consumerKey + '&client_secret=' + consumerSecretKey)
    res_split = res.text.split('&')
    oauth_token = res_split[0].split('=')[1]
    data.updateUser(TokenManager.getTokenUser(req_data.get("token")), {"github": {"token": oauth_token}})
    return {"message": "connected as " + oauth_token}

def getLastStar(user, repoLink):
    pass


