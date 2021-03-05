from app import app, data
import os
import flask
import requests
import sys
import json
from utils import diffFirstSecond

import _
import google.oauth2.credentials
import google_auth_oauthlib.flow
import googleapiclient.discovery

API_SERVICE_NAME = 'youtube'
API_VERSION = 'v3'

def getLastSubscriber(user, area):
    c = google.oauth2.credentials.Credentials(**user.get("Google.credential"))

    youtube = googleapiclient.discovery.build(
        API_SERVICE_NAME, API_VERSION, credentials=c)
    
    request = youtube.subscriptions().list(
        part="subscriberSnippet",
        maxResults=50,
        mySubscribers=True
    )
    lastSubscriber = request.execute()
    lastSubscriberTab = []
    for subscriber in lastSubscriber.get('items'):
        if (_.get(subscriber, 'id') == None or _.get(subscriber, 'subscriberSnippet.title') == None or _.get(subscriber, 'subscriberSnippet.description') == None or _.get(subscriber, 'subscriberSnippet.thumbnails.medium.url') == None):
            continue
        lastSubscriberTab.append({'id':_.get(subscriber, 'id'), 'title':_.get(subscriber, 'subscriberSnippet.title'), 'description':_.get(subscriber, 'subscriberSnippet.description'), 'url':_.get(subscriber, 'subscriberSnippet.thumbnails.medium.url')})
    if area.getValue("youtube") == None:
        area.setValue("youtube", {'lastSubscriber':lastSubscriberTab})
        return (None)
    oldSubscriber = area.getValue("youtube")
    if oldSubscriber.get('lastSubscriber') == None:
        oldSubscriber['lastSubscriber'] = lastSubscriberTab
        area.setValue("youtube", oldSubscriber)
        return (None)
    oldSub = oldSubscriber['lastSubscriber']
    diff = diffFirstSecond(oldSub, lastSubscriberTab, lambda x,y: x.get('id') == y.get('id'))
    if (len(diff) == 0):
        oldSubscriber['lastSubscriber'] = lastSubscriberTab
        area.setValue("youtube", oldSubscriber)
        return (None)
    else:
        oldSubscriber['lastSubscriber'] = lastSubscriberTab
        area.setValue("youtube", oldSubscriber)
        return (diff)


def getLastLikedVideo(user, area):
    c = google.oauth2.credentials.Credentials(**user.get("Google.credential"))

    youtube = googleapiclient.discovery.build(
        API_SERVICE_NAME, API_VERSION, credentials=c)
    
    request = youtube.videos().list(
        part="snippet,contentDetails,statistics",
        maxResults=50,
        myRating="like"
    )
    lastSubscriber = request.execute()
    lastLikeTab = []
    for subscriber in lastSubscriber.get('items'):
        if (_.get(subscriber, 'id') == None or _.get(subscriber, 'snippet.title') == None or _.get(subscriber, 'snippet.description') == None or _.get(subscriber, 'snippet.thumbnails.medium.url') == None):
            continue
        lastLikeTab.append({'id':_.get(subscriber, 'id'), 'title':_.get(subscriber, 'snippet.title'), 'description':_.get(subscriber, 'snippet.description'), 'url':_.get(subscriber, 'snippet.thumbnails.medium.url')})
    if area.getValue("youtube") == None:
        area.setValue("youtube", {'lastLike':lastLikeTab})
        return (None)
    oldLike = area.getValue("youtube")
    if oldLike.get('lastLike') == None:
        oldLike['lastLike'] = lastLikeTab
        area.setValue("youtube", oldLike)
        return (None)
    oldSub = oldLike['lastLike']
    diff = diffFirstSecond(oldSub, lastLikeTab, lambda x,y: x.get('id') == y.get('id'))
    if (len(diff) == 0):
        oldLike['lastLike'] = lastLikeTab
        area.setValue("youtube", oldLike)
        return (None)
    else:
        oldLike['lastLike'] = lastLikeTab
        area.setValue("youtube", oldLike)
        return (diff)

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