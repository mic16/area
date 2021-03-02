
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
import qsparser

consumerKey = "DTGYoaM8PlsMw6Zf42dhor8Rj"
consumerSecretKey = "4JyPpImRxcoxSi3acwVkMZAK1tgghpKpPsrFddETgXYNhKDSt9"

oauth = Client(consumerKey, client_secret=consumerSecretKey)

def loginTwitter():
    uri, headers, body = oauth.sign('https://twitter.com/oauth/request_token')
    res = requests.get(uri, headers=headers, data=body)
    res_split = res.text.split('&')
    oauth_token = res_split[0].split('=')[1]
    return 'https://api.twitter.com/oauth/authenticate?oauth_token=' + oauth_token

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
    if not (user := tokenManager.getTokenUser(req_data.get("token"))):
        return ({"error": "bad token"})
    parser = callbackParser()
    args = parser.parse_args()

    if not args.get('oauth_token'):
        return {"error": "Missing 'oauth_token' in query string"}
    if not args.get('oauth_verifier'):
        return {"error": "Missing 'oauth_verifier' in query string"}
    
    try:
        res = requests.post('https://api.twitter.com/oauth/access_token?oauth_token=%s&oauth_verifier=%s' % (args['oauth_token'], args['oauth_verifier']))

        options = qsparser.parse(res.text)
        
        if not (oauth_token := options.get('oauth_token')):
            return {"error": "Missing 'oauth_token' in twitter response"}

        if not (oauth_secret := options.get('oauth_token_secret')):
            return {"error": "Missing 'oauth_token_secret' in twitter response"}
        
        data.updateUser(user, {"twitter": {"token": oauth_token, "token_secret": oauth_secret}})
    except Exception as err:
        return {"error": err}

    return {"result": "Twitter account linked to user '%s'" % (user.getMail())}

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