from app import app, data
import os
import flask
import requests
import sys
from TokenManager import TokenManager

import google.oauth2.credentials
import google_auth_oauthlib.flow
import googleapiclient.discovery

CLIENT_SECRETS_FILE = "API/code_secret_client_108810952137-1tic3bntk3p466t851t1c89p5a75r6bj.apps.googleusercontent.com.json"
SCOPES = ['https://www.googleapis.com/auth/youtube.force-ssl']
API_SERVICE_NAME = 'youtube'
API_VERSION = 'v3'

@app.route('/loginYoutube')
def loginYoutube():
    tokenManager = TokenManager()
    req_data = flask.request.get_json()
    if (req_data.get("token") == None):
        return ({"error": "no token"})
    if (tokenManager.getTokenUser(req_data.get("token")) == None):
        return ({"error": "bad token"})
    flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
        CLIENT_SECRETS_FILE, scopes=SCOPES)
    flow.redirect_uri = flask.url_for('oauthAuthorizedYoutube', _external=True)

    authorization_url, state = flow.authorization_url(
        access_type='offline',
        include_granted_scopes='true')
    flask.session['state'] = state
    return flask.redirect(authorization_url)


@app.route('/oauthAuthorizedYoutube')
def oauthAuthorizedYoutube():
    tokenManager = TokenManager()
    req_data = flask.request.get_json()
    if (req_data.get("token") == None):
        return ({"error": "no token"})
    if (tokenManager.getTokenUser(req_data.get("token")) == None):
        return ({"error": "bad token"})

    state = flask.session['state']

    flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
        CLIENT_SECRETS_FILE, scopes=SCOPES, state=state)
    flow.redirect_uri = flask.url_for('oauthAuthorizedYoutube', _external=True)

    authorization_response = flask.request.url
    flow.fetch_token(authorization_response=authorization_response)

    credentials = flow.credentials

    data.updateUser(tokenManager.getTokenUser(req_data.get("token")), {"youtube": {"credential":  credentials_to_dict(credentials)}})

    return {"message": "user connected"}

def Diff(li1, li2):
    return (list(list(set(li1)-set(li2)) + list(set(li2)-set(li1))))

def getLastSubscriber(user):

    c = google.oauth2.credentials.Credentials(**user.get("youtube.credential"))

    youtube = googleapiclient.discovery.build(
        API_SERVICE_NAME, API_VERSION, credentials=c)
    
    request = youtube.subscriptions().list(
        part="subscriberSnippet",
        maxResults=50,
        mySubscribers=True
    )
    response = request.execute()

    if (user.get("youtube.subscriber") == None):
        user.set("youtube.subscriber", response)
        return (None)
    oldSubscriber = user.get("youtube.subscriber")
    if (len(oldSubscriber) != len(response)):
        diff = Diff(response, oldSubscriber)

        if (len(diff) == 0):
            user.set("youtube.subscriber", response)
            return (None)
        else:
            user.set("youtube.subscriber", response)
            tab = []
            for u in diff:
                tab.append(u.title)
            return (tab)
    else:
        return (None)


def getLastLikedVideo(user):
    pass


def credentials_to_dict(credentials):
    return {'token': credentials.token,
            'refresh_token': credentials.refresh_token,
            'token_uri': credentials.token_uri,
            'client_id': credentials.client_id,
            'client_secret': credentials.client_secret,
            'scopes': credentials.scopes}