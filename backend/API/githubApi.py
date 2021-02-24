
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
    data.updateUser(TokenManager.getTokenUser(req_data.get("token")), {"github": {"token": oauth_token}})
    return {"message": "connected as " + oauth_token}

def Diff(li1, li2):
    return (list(list(set(li1)-set(li2)) + list(set(li2)-set(li1))))


@app.route('/a')
def getLastStar(user, repoLink):
    git = Github(user.get("github.token"))
    repoLinkSplited = repoLink.rsplit('/', 1)
    repo = git.get_repo(repoLinkSplited[-2] + '/' + repoLinkSplited[-1])
    lastStargazers = repo.get_stargazers_with_dates()

    # lastStarsTab = []
    # for lastStar in lastStargazers:
    #     lastStarsTab.append(json.dumps(lastStar.__dict__))

    # if (user.get("github.lastStars") == None):
    #     user.set("github.lastStars", lastStarsTab)
    #     return (None)
    # oldStars = user.get("github.lastStars")
    # diff = Diff(lastStarsTab, oldStars)
    # if (len(diff) == 0):
    #     return (None)
    # else:
    #     user.set("github.lastStars", lastStarsTab)
    #     return (diff)

    lastStarsTab = []
    for star in lastStargazers:
        lastStarsTab.append(star.__dict__)

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

    lastFollowersTab = []
    for lastFollower in lastFollowers:
        lastFollowersTab.append(json.dumps(lastFollower.__dict__))

    if (user.get("github.lastFollowers") == None):
        user.set("github.lastFollowers", lastFollowersTab)
        return (None)
    oldFollowers = user.get("github.lastFollowers")
    diff = Diff(lastFollowersTab, oldFollowers)
    if (len(diff) == 0):
        return (None)
    else:
        user.set("github.lastFollowers", lastFollowersTab)
        return (diff)