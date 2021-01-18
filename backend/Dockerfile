FROM python:3.8

WORKDIR /var/app
ADD ./ ./

RUN pip3 install flask --trusted-host pypi.python.org

CMD [ "python3", "-m", "flask", "run" ]