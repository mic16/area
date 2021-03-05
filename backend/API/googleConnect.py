from app import app, data
import os
import flask
import requests
import sys
from TokenManager import TokenManager
import OAuthManager

import google.oauth2.credentials
import google_auth_oauthlib.flow

CLIENT_SECRETS_FILE = "API/code_secret_client_108810952137-1tic3bntk3p466t851t1c89p5a75r6bj.apps.googleusercontent.com.json"
SCOPES = ['https://www.googleapis.com/auth/youtube.force-ssl',
          'https://www.googleapis.com/auth/gmail.compose']

tokenState = {}

def loginGoogle():
    tokenManager = TokenManager()
    req_data = flask.request.get_json()
    if not req_data:
        return {"error": "Missing JSON body"}
    if (req_data.get("token") == None):
        return ({"error": "Missing token in body"})
    if not (user := tokenManager.getTokenUser(req_data.get("token"))):
        return ({"error": "bad token"})

    flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
        CLIENT_SECRETS_FILE, scopes=SCOPES)
    flow.redirect_uri = 'http://localhost:8081/oauth/Google'

    authorization_url, state = flow.authorization_url(
        access_type='offline',
        include_granted_scopes='true')
    tokenState[user] = state
    return authorization_url

def oauthAuthorizedGoogle():
    tokenManager = TokenManager()
    req_data = flask.request.get_json()
    if not req_data:
        return {"error": "Missing JSON body"}
    if (req_data.get("token") == None):
        return ({"error": "Missing token in body"})
    if not (user := tokenManager.getTokenUser(req_data.get("token"))):
        return ({"error": "bad token"})
    if not (state := tokenState.get(user)):
        return {"error": "Couldn't finish linking process"}

    flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
        CLIENT_SECRETS_FILE, scopes=None, state=state)
    flow.redirect_uri = 'http://localhost:8081/oauth/Google'

    authorization_response = flask.request.url
    try:
        flow.fetch_token(authorization_response=authorization_response)

        credentials = flow.credentials

        data.updateUser(user, {"Google": {"credential":  credentials_to_dict(credentials)}})
    except Exception as err:
        return {"error": err}

    return {"result": "Google account linked to user '%s'" % (user)}

def googleConnected(user):
    if user.get("Google") != None and user.get("Google.credential") != None:
        return (True)
    return (False)

OAuthManager.addManager('Google', loginGoogle, oauthAuthorizedGoogle, googleConnected)


def credentials_to_dict(credentials):
    return {'token': credentials.token,
            'refresh_token': credentials.refresh_token,
            'token_uri': credentials.token_uri,
            'client_id': credentials.client_id,
            'client_secret': credentials.client_secret,
            'scopes': credentials.scopes}