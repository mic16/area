from flask import Blueprint
from flask import request

account_api = Blueprint('account_api', __name__)

@account_api.route("/login", methods=['POST'])
def login():
    # print(request.form['username'], request.form['password'])
    pass

# @account_api.route("/register", methods=['POST'])
# def login():
#     pass

# @account_api.route("/logout", methods=['POST'])
# def login():
#     pass