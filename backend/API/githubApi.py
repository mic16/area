
from flask import redirect, request
from app import app, data
import requests
from requests_oauthlib.oauth1_auth import Client
from flask_restful import Resource, reqparse
from TokenManager import TokenManager
from github import Github
from utils import diffFirstSecond
import json
import OAuthManager
import qsparser

import sys

consumerKey = "c7d15d2078ee6a30d76b"
consumerSecretKey = "20239e2887de5e83479d17c8ae6fb440af515483"

oauth = Client(consumerKey, client_secret=consumerSecretKey)

def loginGithub():
    return 'https://github.com/login/oauth/authorize?client_id=' + consumerKey

def callbackParser():
    parser = reqparse.RequestParser()
    parser.add_argument('code')
    return parser
    
def oauthAuthorizedGithub():
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

    if not args.get('code'):
        return {"error": "Missing 'code' in query string"}

    try:
        res = requests.post('https://github.com/login/oauth/access_token?code=%s&client_id=%s&client_secret=%s' % (args['code'], consumerKey, consumerSecretKey))
        options = qsparser.parse(res.text)

        if not options.get('access_token'):
            return {"error": "Missing 'access_token' in Github response"}
        
        data.updateUser(user, {"github": {"token": options.get('access_token')}})
    except Exception as err:
        return {"error": err}

    return {"result": "Github account linked to user '%s'" % (user)}


def githubConnected(user):
    if user.get("github") != None and user.get("github.token") != None:
        return (True)
    return (False)

OAuthManager.addManager('Github', loginGithub, oauthAuthorizedGithub, githubConnected)


def getLastStar(user, area):
    git = Github(user.get("github.token"))
    lastStarred = git.get_user().get_starred()
    count = 0
    lastStarsTab = []
    for star in lastStarred:
        lastStarsTab.append({'id':star.id, 'name':star.full_name, 'description': star.description, 'starNb': star.get_stargazers().totalCount})
        if (count == 20):
            break
        count += 1
    if area.getValue("github") == None:
        area.setValue("github", {'lastStars':lastStarsTab})
        return (None)
    oldGithub = area.getValue("github")
    if oldGithub.get('lastStars') == None:
        oldGithub['lastStars'] = lastStarsTab
        area.setValue("github", oldGithub)
        return (None)
    oldStars = oldGithub['lastStars']
    diff = diffFirstSecond(oldStars, lastStarsTab, lambda x,y: x.get('id') == y.get('id'))
    if (len(diff) == 0):
        oldGithub['lastStars'] = lastStarsTab
        area.setValue("github", oldGithub)
        return (None)
    else:
        oldGithub['lastStars'] = lastStarsTab
        area.setValue("github", oldGithub)
        return (diff)


def getNewFollower(user, area):
    git = Github(user.get("github.token"))
    lastFollowers = git.get_user().get_followers().reversed
    count = 0
    lastFollowersTab = []
    for follower in lastFollowers:
        lastFollowersTab.append({'id':follower.id, 'name':follower.name, 'avatarUrl': follower.avatar_url, 'bio': follower.bio})
        if (count == 20):
            break
        count += 1
    if area.getValue("github") == None:
        area.setValue("github", {'lastFollowers':lastFollowersTab})
        return (None)
    oldGithub = area.getValue("github")
    if oldGithub.get('lastFollowers') == None:
        oldGithub['lastFollowers'] = lastFollowersTab
        area.setValue("github", oldGithub)
        return (None)
    oldFollowers = oldGithub['lastFollowers']
    diff = diffFirstSecond(oldFollowers, lastFollowersTab, lambda x,y: x.get('id') == y.get('id'))
    if (len(diff) == 0):
        oldGithub['lastFollowers'] = lastFollowersTab
        area.setValue("github", oldGithub)
        return (None)
    else:
        oldGithub['lastFollowers'] = lastFollowersTab
        area.setValue("github", oldGithub)
        return (diff)