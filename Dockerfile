FROM node:latest

WORKDIR /api

COPY . /api

EXPOSE 8080

RUN npm install

CMD ["/bin/bash", "/api/entrypoint.sh"]

