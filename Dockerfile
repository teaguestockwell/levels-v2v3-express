#FROM node:14.15.4
FROM registry1.dso.mil/ironbank/opensource/nodejs/nodejs14:14.15.5


LABEL maintainer="tstockwell@tronaf.dev" 

WORKDIR /api

COPY . /api

EXPOSE 8080

RUN npm install

CMD ["/bin/bash", "/api/entrypoint.sh"]

