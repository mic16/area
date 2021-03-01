
from flask import redirect, request
from app import app, data
import requests
from requests_oauthlib.oauth1_auth import Client
from flask_restful import Resource, reqparse
import sys
import json
import tweepy
from TokenManager import TokenManager
import OAuthManager

consumerKey = "DTGYoaM8PlsMw6Zf42dhor8Rj"
consumerSecretKey = "4JyPpImRxcoxSi3acwVkMZAK1tgghpKpPsrFddETgXYNhKDSt9"

oauth = Client(consumerKey, client_secret=consumerSecretKey)

def loginTwitter():
    tokenManager = TokenManager()
    req_data = request.get_json()
    if (req_data.get("token") == None):
        return ({"error": "no token"})
    if (tokenManager.getTokenUser(req_data.get("token")) == None):
        return ({"error": "bad token"})
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

    data.updateUser(tokenManager.getTokenUser(req_data.get("token")), {"twitter": {"token": oauth_token, "token_secret": oauth_secret}})
    
    print(oauth_token, file=sys.stderr)

    return {"message": "connected as " + username}


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


def Diff(li1, li2):
    return (list(list(set(li1)-set(li2)) + list(set(li2)-set(li1))))

def getLastTweetTimeline(user):
    auth = tweepy.OAuthHandler(consumerKey, consumerSecretKey)     
    auth.set_access_token(user.get("twitter.token"), user.get("twitter.token_secret"))
    api = tweepy.API(auth) 

    lastTweets = api.user_timeline(include_entities=True, count = 50)

    lastTweetsTab = []
    for lastTweet in lastTweets:
        lastTweetsTab.append(json.dumps(lastTweet.__dict__))

    if (user.get("twitter.lastTweet") == None):
        user.set("twitter.lastTweet", lastTweetsTab)
        return (None)
    oldTweets = user.get("twitter.lastTweet")
    diff = Diff(lastTweetsTab, oldTweets)
    if (len(diff) == 0):
        return (None)
    else:
        user.set("twitter.lastTweet", lastTweetsTab)
        return (diff)


def getLastLike(user):
    auth = tweepy.OAuthHandler(consumerKey, consumerSecretKey)     
    auth.set_access_token(user.get("twitter.token"), user.get("twitter.token_secret"))
    api = tweepy.API(auth) 

    lastFavs = api.favorites(include_entities=True, count = 50)

    lastTweetsTab = []
    for lastTweet in lastFavs:
        lastTweetsTab.append(json.dumps(lastTweet.__dict__))

    if (user.get("twitter.lastLike") == None):
        user.set("twitter.lastLike", lastTweetsTab)
        return (None)
    oldTweets = user.get("twitter.lastLike")
    diff = Diff(lastTweetsTab, oldTweets)
    if (len(diff) == 0):
        return (None)
    else:
        user.set("twitter.lastLike", lastTweetsTab)
        return (diff)
