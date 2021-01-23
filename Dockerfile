FROM node:latest

WORKDIR /api

COPY . /api

EXPOSE 8080

CMD npm run devstart

