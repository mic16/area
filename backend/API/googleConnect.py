from app import app, data
import os
import flask
import requests
import sys
from TokenManager import TokenManager

import google.oauth2.credentials
import google_auth_oauthlib.flow

CLIENT_SECRETS_FILE = "API/code_secret_client_108810952137-1tic3bntk3p466t851t1c89p5a75r6bj.apps.googleusercontent.com.json"
SCOPES = ['https://www.googleapis.com/auth/youtube.force-ssl',
          'https://www.googleapis.com/auth/gmail.compose']

@app.route('/loginGoogle')
def loginGoogle():
    tokenManager = TokenManager()
    req_data = flask.request.get_json()
    if (req_data.get("token") == None):
        return ({"error": "no token"})
    if (tokenManager.getTokenUser(req_data.get("token")) == None):
        return ({"error": "bad token"})
    flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
        CLIENT_SECRETS_FILE, scopes=SCOPES)
    flow.redirect_uri = flask.url_for('oauthAuthorizedGoogle', _external=True)

    authorization_url, state = flow.authorization_url(
        access_type='offline',
        include_granted_scopes='true')
    flask.session['state'] = state
    return flask.redirect(authorization_url)

@app.route('/oauthAuthorizedGoogle')
def oauthAuthorizedGoogle():
    tokenManager = TokenManager()
    req_data = flask.request.get_json()
    if (req_data.get("token") == None):
        return ({"error": "no token"})
    if (tokenManager.getTokenUser(req_data.get("token")) == None):
        return ({"error": "bad token"})
    state = flask.session['state']

    flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
        CLIENT_SECRETS_FILE, scopes=None, state=state)
    flow.redirect_uri = flask.url_for('oauthAuthorizedGoogle', _external=True)

    authorization_response = flask.request.url
    flow.fetch_token(authorization_response=authorization_response)

    credentials = flow.credentials
    
    data.updateUser(tokenManager.getTokenUser(req_data.get("token")), {"Google": {"credential":  credentials_to_dict(credentials)}})

    return {"message": "user connected"}

def credentials_to_dict(credentials):
    return {'token': credentials.token,
            'refresh_token': credentials.refresh_token,
            'token_uri': credentials.token_uri,
            'client_id': credentials.client_id,
            'client_secret': credentials.client_secret,
            'scopes': credentials.scopes}