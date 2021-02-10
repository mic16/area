FROM node:14.15

WORKDIR /var/app
ADD ./ ./

RUN yarn install
RUN yarn global add expo-cli
EXPOSE 3000

CMD ["yarn", "web"]