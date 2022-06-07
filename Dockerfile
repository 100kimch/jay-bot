FROM node:18.2.0

ENV HOME /usr/src/jay-bot
WORKDIR $HOME

COPY ["package.json", "yarn.lock", "tsconfig.json", "$HOME/"]
RUN yarn

COPY ./src $HOME/src
RUN yarn build

EXPOSE 8080

CMD ["yarn", "start"]
