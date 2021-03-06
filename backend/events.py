from app import app
from flask import Flask, request
import json

@app.after_request
def after_request(response):
    url = ' %s ' % request.base_url
    blocklen = len(url) + 2
    print('='*blocklen)
    print(url.center(blocklen, '='))
    print('=%s=' % ('REQUEST'.center(blocklen - 2, '-')))
    rbody = request.get_data().decode()
    rtext = json.dumps(json.loads(rbody), indent=4)
    for i in rtext.split('\n'):
        print(i)
    print('=%s=' % ('RESPONSE'.center(blocklen - 2, '-')))
    body = response.get_data().decode()
    text = json.dumps(json.loads(body), indent=4)
    for i in text.split('\n'):
        print(i)
    print('-'*blocklen)
    print('='*blocklen)
    return response