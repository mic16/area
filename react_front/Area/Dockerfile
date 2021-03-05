FROM node:14.15

WORKDIR /var/app
ADD ./ ./

RUN yarn install
RUN yarn global add expo-cli
RUN npm install -g turtle-cli --unsafe-perm
EXPOSE 3000

CMD ["turtle", "build:android"]