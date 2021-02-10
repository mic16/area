FROM python:3.9

WORKDIR /var/app
ADD ./ ./

RUN pip3 install flask --trusted-host pypi.python.org
RUN pip3 install rejson --trusted-host pypi.python.org
RUN pip3 install python-twitter --trusted-host pypi.python.org
RUN pip3 install requests-oauthlib --trusted-host pypi.python.org
RUN pip3 install flask-restful --trusted-host pypi.python.org
RUN pip3 install --upgrade google-api-python-client --trusted-host pypi.python.org
RUN pip3 install --upgrade google-auth google-auth-oauthlib google-auth-httplib2 --trusted-host pypi.python.org

EXPOSE 5000

CMD [ "python3", "-m", "flask", "run", "--host", "0.0.0.0" ]