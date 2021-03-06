FROM node:14.15

WORKDIR /var/app

COPY package.json .

RUN yarn global add expo-cli && \
    yarn install

COPY ./ ./

EXPOSE 3000

CMD ["yarn", "web"]