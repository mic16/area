
from flask import redirect, request
from app import app, data
import requests
from requests_oauthlib.oauth1_auth import Client
from flask_restful import Resource, reqparse
from TokenManager import TokenManager
from github import Github
from utils import diffFirstSecond
import json

import sys

consumerKey = "c7d15d2078ee6a30d76b"
consumerSecretKey = "20239e2887de5e83479d17c8ae6fb440af515483"

oauth = Client(consumerKey, client_secret=consumerSecretKey)

@app.route('/loginGithub', methods = [ 'GET', 'POST' ])
def loginGithub():
    req_data = request.get_json()
    if (req_data.get("token") == None):
        return ({"error": "no token"})
    if (TokenManager.getTokenUser(req_data.get("token")) == None):
        return ({"error": "bad token"})
    return redirect('https://github.com/login/oauth/authorize?client_id=' + consumerKey)

def callbackParser():
    parser = reqparse.RequestParser()
    parser.add_argument('code')
    return parser
    
@app.route('/oauthAuthorizedGithub')
def oauthAuthorizedGithub():
    req_data = request.get_json()
    if (req_data.get("token") == None):
        return ({"error": "no token"})
    if (TokenManager.getTokenUser(req_data.get("token")) == None):
        return ({"error": "bad token"})
    parser = callbackParser()
    args = parser.parse_args()
    res = requests.post(' https://github.com/login/oauth/access_token?code=' + args['code'] + '&client_id=' + consumerKey + '&client_secret=' + consumerSecretKey)
    res_split = res.text.split('&')
    oauth_token = res_split[0].split('=')[1]
    data.updateUser(TokenManager.getTokenUser(req_data.get("token")), {"github": None})
    data.updateUser(TokenManager.getTokenUser(req_data.get("token")), {"github": {"token": oauth_token}})

    return {"message": "connected as " + oauth_token}

def Diff(li1, li2):
    return (list(list(set(li1)-set(li2)) + list(set(li2)-set(li1))))


def getLastStar(user):
    git = Github(user.get("github.token"))
    lastStarred = git.get_user().get_starred().reversed
    count = 0
    lastStarsTab = []
    for star in lastStarred:
        lastStarsTab.append({'name':star.full_name, 'description': star.description, 'starNb': star.get_stargazers().totalCount})
        if (count == 20):
            break
        count += 1
    if user.get("github") == None:
        user.set("github", {'lastStars':lastStarsTab})
        return (None)
    oldGithub = user.get("github")
    if oldGithub.get('lastStars') == None:
        oldGithub['lastStars'] = lastStarsTab
        user.set("github", oldGithub)
        return (None)
    oldStars = oldGithub['lastStars']
    diff = diffFirstSecond(lastStarsTab, oldStars)
    if (len(diff) == 0):
        oldGithub['lastStars'] = lastStarsTab
        user.set("github", oldGithub)
        return (None)
    else:
        oldGithub['lastStars'] = lastStarsTab
        user.set("github", oldGithub)
        return (diff)


def getNewFollower(user):
    git = Github(user.get("github.token"))
    lastFollowers = git.get_user().get_followers()
    count = 0
    lastFollowersTab = []
    for follower in lastFollowers:
        lastFollowersTab.append({'name':follower.full_name, 'avatarUrl': follower.avatar_url, 'bio': follower.bio})
        if (count == 20):
            break
        count += 1
    if user.get("github") == None:
        user.set("github", {'lastFollowers':lastFollowersTab})
        return (None)
    oldGithub = user.get("github")
    if oldGithub.get('lastFollowers') == None:
        oldGithub['lastFollowers'] = lastFollowersTab
        user.set("github", oldGithub)
        return (None)
    oldFollowers = oldGithub['lastFollowers']
    diff = diffFirstSecond(lastFollowersTab, oldFollowers)
    if (len(diff) == 0):
        oldGithub['lastFollowers'] = lastFollowersTab
        user.set("github", oldGithub)
        return (None)
    else:
        oldGithub['lastFollowers'] = lastFollowersTab
        user.set("github", oldGithub)
        return (diff)