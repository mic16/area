from app import app, data
import os
import flask
import requests
import sys
import json
import base64
from email.mime.text import MIMEText

import google.oauth2.credentials
import google_auth_oauthlib.flow
import googleapiclient.discovery

API_SERVICE_NAME = 'gmail'
API_VERSION = 'v1'

def create_message(sender, to, subject, message_text):
    message = MIMEText(message_text)
    message['to'] = to
    message['from'] = sender
    message['subject'] = subject
    raw_message = base64.urlsafe_b64encode(message.as_string().encode("utf-8"))
    return {
        'raw': raw_message.decode("utf-8")
    }

def sendMail(user, message, userId, obj):
    c = google.oauth2.credentials.Credentials(**user.get("Google.credential"))
    gmail = googleapiclient.discovery.build(
        API_SERVICE_NAME, API_VERSION, credentials=c)
    encodedMessage = create_message('me', userId, obj, message)
    res = gmail.users().messages().send(userId='me', body=encodedMessage).execute()

def Diff(li1, li2):
    return (list(list(set(li1)-set(li2)) + list(set(li2)-set(li1))))

def getLastMail(user):
    c = google.oauth2.credentials.Credentials(**user.get("Google.credential"))
    gmail = googleapiclient.discovery.build(
        API_SERVICE_NAME, API_VERSION, credentials=c)
    res = gmail.users().messages().list(userId='me', maxResults=50)


    lastMailsTab = []
    for lastMail in res:
        lastMailsTab.append(json.dumps(lastMail.__dict__))

    if (user.get("gmail.lastMail") == None):
        user.set("gmail.lastMail", lastMailsTab)
        return (None)
    oldMails = user.get("gmail.lastMail")
    diff = Diff(lastMailsTab, oldMails)
    if (len(diff) == 0):
        return (None)
    else:
        user.set("gmail.lastMail", lastMailsTab)
        resTab = []
        for d in diff:
            resTab.append(gmail.users().messages().get(id=d['messages']['id'], userId='me'))
        return (resTab)