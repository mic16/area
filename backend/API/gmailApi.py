from app import app, data
import os
import flask
import requests
import sys
import json
import base64
from email.mime.text import MIMEText
from utils import diffFirstSecond

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

def getLastMail(user, area):
    c = google.oauth2.credentials.Credentials(**user.get("Google.credential"))
    gmail = googleapiclient.discovery.build(
        API_SERVICE_NAME, API_VERSION, credentials=c)
    lastMails = gmail.users().messages().list(userId='me', maxResults=50).execute()
    lastMailTab = []
    for mail in lastMails.get('messages'):
        lastMailTab.append(mail)
    if area.getValue("gmail") == None:
        area.setValue("gmail", {'lastMail':lastMailTab})
        return (None)
    oldGmail = area.getValue("gmail")
    if oldGmail.get('lastMail') == None:
        oldGmail['lastMail'] = lastMailTab
        area.setValue("gmail", oldGmail)
        return (None)
    oldMails = oldGmail['lastMail']
    diff = diffFirstSecond(lastMailTab, oldMails, lambda x,y: x.id == y.id)
    if (len(diff) == 0):
        oldGmail['lastMail'] = lastMailTab
        area.setValue("gmail", oldGmail)
        return (None)
    else:
        oldGmail['lastMail'] = lastMailTab
        area.setValue("gmail", oldGmail)
        resTab = []
        for d in diff:
            resTab.append(gmail.users().messages().get(id=d['id'], userId='me').execute())
        return (resTab)