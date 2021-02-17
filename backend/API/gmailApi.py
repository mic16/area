from app import app, data
import os
import flask
import requests
import sys
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

def sendMail(user, userId, message, obj):
    c = google.oauth2.credentials.Credentials(**user.get("Google.credential"))
    gmail = googleapiclient.discovery.build(
        API_SERVICE_NAME, API_VERSION, credentials=c)
    encodedMessage = create_message('me', userId, obj, message)
    res = gmail.users().messages().send(userId='me', body=encodedMessage).execute()
