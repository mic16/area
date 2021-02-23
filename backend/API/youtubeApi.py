from app import app, data
import os
import flask
import requests
import sys

import google.oauth2.credentials
import google_auth_oauthlib.flow
import googleapiclient.discovery

API_SERVICE_NAME = 'youtube'
API_VERSION = 'v3'

def Diff(li1, li2):
    return (list(list(set(li1)-set(li2)) + list(set(li2)-set(li1))))

def getLastSubscriber(user):

    c = google.oauth2.credentials.Credentials(**user.get("Google.credential"))

    youtube = googleapiclient.discovery.build(
        API_SERVICE_NAME, API_VERSION, credentials=c)
    
    request = youtube.subscriptions().list(
        part="subscriberSnippet",
        maxResults=50,
        mySubscribers=True
    )
    response = request.execute()

    if (user.get("youtube.subscriber") == None):
        user.set("youtube.subscriber", response['items'])
        return (None)
    oldSubscriber = user.get("youtube.subscriber")
    if (len(oldSubscriber) != len(response['items'])):
        diff = Diff(response['items'], oldSubscriber)

        if (len(diff) == 0):
            return (None)
        else:
            user.set("youtube.subscriber", response['items'])
            tab = []
            for u in diff:
                tab.append(u["subscriberSnippet"]["title"])
            return (tab)
    else:
        return (None)


def getLastLikedVideo(user):
    c = google.oauth2.credentials.Credentials(**user.get("Google.credential"))

    youtube = googleapiclient.discovery.build(
        API_SERVICE_NAME, API_VERSION, credentials=c)
    
    request = youtube.videos().list(
        part="snippet,contentDetails,statistics",
        maxResults=50,
        myRating="like"
    )

    response = request.execute()

    if (user.get("youtube.likes") == None):
        user.set("youtube.likes", response['items'])
        return (None)
    oldlikes = user.get("youtube.likes")
    if (len(oldlikes) != len(response['items'])):
        diff = Diff(response['items'], oldlikes)

        if (len(diff) == 0):
            return (None)
        else:
            user.set("youtube.likes", response['items'])
            tab = []
            for u in diff:
                tab.append(u["subscriberSnippet"]["title"])
            return (tab)
    else:
        return (None)

def sendNewComment(user, videoId, text):

    c = google.oauth2.credentials.Credentials(**user.get("Google.credential"))

    youtube = googleapiclient.discovery.build(
        API_SERVICE_NAME, API_VERSION, credentials=c)

    request = youtube.commentThreads().insert(
        part="snippet",
        body={
          "snippet": {
            "videoId": videoId,
            "topLevelComment": {
              "snippet": {
                "textOriginal": text
              }
            }
          }
        }
    )
    request.execute()