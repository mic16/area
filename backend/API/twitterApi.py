
from flask import redirect, request
from app import app, data
import requests
from requests_oauthlib.oauth1_auth import Client
from flask_restful import Resource, reqparse
import sys
from utils import diffFirstSecond
import json
import tweepy
from TokenManager import TokenManager
import OAuthManager

consumerKey = "DTGYoaM8PlsMw6Zf42dhor8Rj"
consumerSecretKey = "4JyPpImRxcoxSi3acwVkMZAK1tgghpKpPsrFddETgXYNhKDSt9"

oauth = Client(consumerKey, client_secret=consumerSecretKey)

def loginTwitter():
    uri, headers, body = oauth.sign('https://twitter.com/oauth/request_token')
    res = requests.get(uri, headers=headers, data=body)
    res_split = res.text.split('&')
    oauth_token = res_split[0].split('=')[1]
    return redirect('https://api.twitter.com/oauth/authenticate?oauth_token=' + oauth_token, 302)

def callbackParser():
    parser = reqparse.RequestParser()
    parser.add_argument('oauth_token')
    parser.add_argument('oauth_verifier')
    return parser

def oauthAuthorizedTwitter():
    tokenManager = TokenManager()
    req_data = request.get_json()
    if not req_data:
        return {"error": "Missing JSON body"}
    if (req_data.get("token") == None):
        return ({"error": "no token"})
    if (tokenManager.getTokenUser(req_data.get("token")) == None):
        return ({"error": "bad token"})
    parser = callbackParser()
    args = parser.parse_args()
    res = requests.post('https://api.twitter.com/oauth/access_token?oauth_token=' + args['oauth_token'] + '&oauth_verifier=' + args['oauth_verifier'])    
    res_split = res.text.split('&')
    oauth_token = res_split[0].split('=')[1]
    oauth_secret = res_split[1].split('=')[1]
    userid = res_split[2].split('=')[1]
    username = res_split[3].split('=')[1]
    
    data.updateUser(tokenManager.getTokenUser(req_data.get("token")), {"twitter": None})
    data.updateUser(tokenManager.getTokenUser(req_data.get("token")), {"twitter": {"token": oauth_token, "token_secret": oauth_secret}})
    return {"message": "connected as " + username}

def twitterConnected(user):
    if user.get("twitter") != None and user.get("twitter.token") != None and user.get("twitter.token_secret") != None:
        return (True)
    return (False)

OAuthManager.addManager('Twitter', loginTwitter, oauthAuthorizedTwitter, twitterConnected)


def newTweet(user, text):
    auth=tweepy.OAuthHandler(consumerKey,consumerSecretKey)
    auth.set_access_token(user.get("twitter.token"), user.get("twitter.token_secret"))
    api=tweepy.API(auth)
    tweet=input(text)
    api.update_status(tweet)

def sendDirectMessage(user, text, userId):
    auth = tweepy.OAuthHandler(consumerKey, consumerSecretKey)     
    auth.set_access_token(user.get("twitter.token"), user.get("twitter.token_secret"))  
    api = tweepy.API(auth) 
    direct_message = api.send_direct_message(userId, text)

def getLastTweetUser(user):
    auth = tweepy.OAuthHandler(consumerKey, consumerSecretKey)     
    auth.set_access_token(user.get("twitter.token"), user.get("twitter.token_secret"))
    api = tweepy.API(auth) 

    lastTweets = api.user_timeline(include_entities=True, count = 50)
    lastTweetTab = []
    for tweet in lastTweets:
        lastTweetTab.append({'text':tweet.text, 'entities':tweet.entities})

    if user.get("twitter") == None:
        user.set("twitter", {'lastTweet':lastTweetTab})
        return (None)
    oldTwiiter = user.get("twitter")
    if oldTwiiter.get('lastTweet') == None:
        oldTwiiter['lastTweet'] = lastTweetTab
        user.set("twitter", oldTwiiter)
        return (None)
    oldTweets = oldTwiiter['lastTweet']
    diff = diffFirstSecond(lastTweetTab, oldTweets)
    if (len(diff) == 0):
        oldTwiiter['lastTweet'] = lastTweetTab
        user.set("twitter", oldTwiiter)
        return (None)
    else:
        oldTwiiter['lastTweet'] = lastTweetTab
        user.set("twitter", oldTwiiter)
        return (diff)

def getLastLike(user):
    auth = tweepy.OAuthHandler(consumerKey, consumerSecretKey)     
    auth.set_access_token(user.get("twitter.token"), user.get("twitter.token_secret"))
    api = tweepy.API(auth) 
    
    lastFavs = api.favorites(include_entities=True, count = 50)
    lastFavTab = []
    for tweet in lastFavs:
        lastFavTab.append(json.dumps({'text':tweet.text, 'entities':tweet.entities}))

    if user.get("twitter") == None:
        user.set("twitter", json.dumps({'lastFav':lastFavTab}))
        return (None)
    oldTwiiter = user.get("twitter")
    if oldTwiiter.get('lastFav') == None:
        oldTwiiter['lastFav'] = lastFavTab
        user.set("twitter", oldTwiiter)
        return (None)
    oldFavs = oldTwiiter['lastFav']
    diff = diffFirstSecond(lastFavTab, oldFavs)
    if (len(diff) == 0):
        oldTwiiter['lastFav'] = lastFavTab
        user.set("twitter", oldTwiiter)
        return (None)
    else:
        oldTwiiter['lastFav'] = lastFavTab
        user.set("twitter", oldTwiiter)
        return (diff)