
from flask import redirect, request
from app import app, data
import requests
from requests_oauthlib.oauth1_auth import Client
from flask_restful import Resource, reqparse
from TokenManager import TokenManager
from github import Github

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

def getLastStar(user, repoLink):
    git = Github(user.get("github.token"))
    repoLinkSplited = repoLink.rsplit('/', 1)
    repo = git.get_repo(repoLinkSplited[-2] + '/' + repoLinkSplited[-1])
    lastStargazers = repo.get_stargazers_with_dates()[0]

    if (user.get("github.lastStarDate") == None):
        user.set("github.lastStarDate", lastStargazers.starred_at)
        return (None)
    if (user.get("github.lastStarDate") < lastStargazers.starred_at):
        user.set("github.lastStarDate", lastStargazers.starred_at)
        return (lastStargazers)
    else:
        return (None)

def getNewFollower(user):
    git = Github(user.get("github.token"))
    followers = git.get_user().get_followers()
    
    if (user.get("github.followers") == None):
        user.set("github.followers", followers)
        return (None)
    oldFollowers = user.get("github.followers")
    if (len(oldFollowers) != len(followers)):
        if (followers[0] in oldFollowers):
            user.set("github.followers", followers)
            return (None)
        else:
            user.set("github.followers", followers)
            return (followers[0])
    else:
        return (None)
