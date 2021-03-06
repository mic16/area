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
    if request and request.get_data() and (rbody := request.get_data().decode()):
        try:
            rtext = json.dumps(json.loads(rbody), indent=4)
            for i in rtext.split('\n'):
                print(i)
        except:
            pass
    print('=%s=' % ('RESPONSE'.center(blocklen - 2, '-')))
    if response and response.get_data() and (body := response.get_data().decode()):
        try:
            text = json.dumps(json.loads(body), indent=4)
            for i in text.split('\n'):
                print(i)
        except:
            pass
    print('-'*blocklen)
    print('='*blocklen)
    return response