from app import app, data
from flask import redirect, request
from flask_restful import Resource, reqparse
import requests
import json
from TokenManager import TokenManager

from imgurpython import ImgurClient

client_id = '0beee62c1273552'
client_secret = '1d2a939c474367667bdd4de55ede8b67b633694a'

@app.route('/loginImgur', methods = [ 'GET', 'POST' ])
def loginImgur():
    client = ImgurClient(client_id, client_secret)
    return redirect(client.get_auth_url('token'))

@app.route('/oauthAuthorizedImgur')
def oauthAuthorizedImgur():
    print (request.get_json )
    return ('ok')


def diffFirstSecond(l1, l2):
    tab = []
    for i in l1:
        a = False
        for j in l2:
            if i == j:
                a = True
        if not a:
            tab.append(i)
    return tab  

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