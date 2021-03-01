from app import app, data
from flask import redirect, request
from flask_restful import Resource, reqparse
import requests
import json
from utils import diffFirstSecond
from TokenManager import TokenManager
import OAuthManager
from imgurpython import ImgurClient

client_id = '0beee62c1273552'
client_secret = '1d2a939c474367667bdd4de55ede8b67b633694a'

def loginImgur():
    client = ImgurClient(client_id, client_secret)
    return client.get_auth_url('token')

def callbackParser():
    parser = reqparse.RequestParser()
    parser.add_argument('access_token')
    parser.add_argument('refresh_token')
    parser.add_argument('account_username')
    return parser

def oauthAuthorizedImgur():
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
    data.updateUser(tokenManager.getTokenUser(req_data.get("token")), {"imgur": None})
    data.updateUser(tokenManager.getTokenUser(req_data.get("token")), {"imgur": {"token": args['access_token'], "refresh_token": args['refresh_token'], "username":args['account_username']}})
    return {"message": "connected as " + args['account_username']}

def imgurConnected(user):
    if user.get("imgur") != None and user.get("imgur.token") != None and user.get("imgur.refresh_token") != None and user.get("imgur.username") != None:
        return (True)
    return (False)

OAuthManager.addManager('Imgur', loginImgur, oauthAuthorizedImgur, imgurConnected)


def getLastFav(user):
    client = ImgurClient(client_id, client_secret, user.get("imgur.token"), user.get("imgur.refresh_token"))

    albums = client.get_account_favorites(user.get("imgur.username"))
    lastAlbumsTab = []
    for album in albums:
        lastAlbumsTab.append(json.dumps(album.__dict__))

    if user.get("imgur") == None:
        user.set("imgur", json.dumps({'lastFav':lastAlbumsTab}))
        return (None)

    oldImgur = user.get("imgur")
    if oldImgur.get('lastFav') == None:
        oldImgur['lastFav'] = lastAlbumsTab
        user.set("imgur", oldImgur)
        return (None)
    oldAlbums = oldImgur['lastFav']
    diff = diffFirstSecond(lastAlbumsTab, oldAlbums)
    if (len(diff) == 0):
        oldImgur['lastFav'] = lastAlbumsTab
        user.set("imgur", oldImgur)
        return (None)
    else:
        oldImgur['lastFav'] = lastAlbumsTab
        user.set("imgur", oldImgur)
        finalRes = []
        for a in diff:
            if json.loads(a)['is_album']:
                imgs = client.get_album_images(json.loads(a)['id'])
                imgsListLink = []
                for i in imgs:
                    imgsListLink.append(i.link)
                finalRes.append({'album':json.loads(a), 'imgs':imgsListLink})
            else:
                finalRes.append({'album':json.loads(a), 'imgs':[json.loads(a)['link']]})
        return (finalRes)

def getLastPost(user):
    client = ImgurClient(client_id, client_secret, user.get("imgur.token"), user.get("imgur.refresh_token"))

    albums = client.get_account_albums(user.get("imgur.username"))
    lastAlbumsTab = []
    for album in albums:
        lastAlbumsTab.append(json.dumps(album.__dict__))
    if user.get("imgur") == None:
        user.set("imgur", json.dumps({'lastAlbums':lastAlbumsTab}))
        return (None)
    oldImgur = user.get("imgur")
    if oldImgur.get('lastAlbums') == None:
        oldImgur['lastAlbums'] = lastAlbumsTab
        user.set("imgur", oldImgur)
        return (None)
    oldAlbums = oldImgur['lastAlbums']
    diff = diffFirstSecond(lastAlbumsTab, oldAlbums)
    if (len(diff) == 0):
        oldImgur['lastAlbums'] = lastAlbumsTab
        user.set("imgur", oldImgur)
        return (None)
    else:
        oldImgur['lastAlbums'] = lastAlbumsTab
        user.set("imgur", oldImgur)
        finalRes = []
        for a in diff:
            imgs = client.get_album_images(json.loads(a)['id'])
            imgsListLink = []
            for i in imgs:
                imgsListLink.append(i.link)
            finalRes.append({'album':json.loads(a), 'imgs':imgsListLink})
        return (finalRes)

def CreateAlbumAndUploadImages(client, albumName, albumDescription, images):
    fields = {}
    fields['title'] = albumName
    fields['description'] = albumDescription
    fields['privacy'] = 'public'
    album = client.create_album(fields)
    client.album_add_images(album['id'],images)

def UploadPhoto(client, imageUrl):
    config = {
        'name':  '',
        'title': '',
        'description': ''}
        
    image = client.upload_from_url(imageUrl, config=config, anon=False)
    return image

def createPost(user, imageUrl, postTitle, postDescription):
    client = ImgurClient(client_id, client_secret, user.get("imgur.token"), user.get("imgur.refresh_token"))
    id = []
    for img in imageUrl:
        id.append( UploadPhoto([img])['id'])
    CreateAlbumAndUploadImages(client, postTitle, postDescription, id)