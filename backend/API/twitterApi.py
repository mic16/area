
from flask import redirect, request
from app import app, data
import requests
from requests_oauthlib.oauth1_auth import Client
from flask_restful import Resource, reqparse
import sys
import tweepy
from TokenManager import TokenManager

consumerKey = "DTGYoaM8PlsMw6Zf42dhor8Rj"
consumerSecretKey = "4JyPpImRxcoxSi3acwVkMZAK1tgghpKpPsrFddETgXYNhKDSt9"

oauth = Client(consumerKey, client_secret=consumerSecretKey)

@app.route('/loginTwitter', methods = [ 'GET', 'POST' ])
def loginTwitter():
    req_data = request.get_json()
    if (req_data.get("token") == None):
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

@app.route('/oauthAuthorizedTwitter')
def oauthAuthorizedTwitter():
    req_data = request.get_json()
    if (req_data.get("token") == None):
        return ({"error": "bad token"})
    parser = callbackParser()
    args = parser.parse_args()
    res = requests.post('https://api.twitter.com/oauth/access_token?oauth_token=' + args['oauth_token'] + '&oauth_verifier=' + args['oauth_verifier'])    
    res_split = res.text.split('&')
    oauth_token = res_split[0].split('=')[1]
    oauth_secret = res_split[1].split('=')[1]
    userid = res_split[2].split('=')[1]
    username = res_split[3].split('=')[1]

    data.updateUser(TokenManager.getTokenUser(req_data.get("token")), {"twitter": {"token": oauth_token, "token_secret": oauth_secret}})
    
    return {"message": "connected as " + username}

def newTweet(user, text):

    auth=tweepy.OAuthHandler(consumerKey,consumerSecretKey)
    auth.set_access_token(user.getTwitterInfo().token, user.getTwitterInfo().oauth_secret)
    api=tweepy.API(auth)

    tweet=input(text)
    api.update_status(tweet)