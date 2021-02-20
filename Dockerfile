#FROM node:14.15.4
FROM egistry.il2.dso.mil/platform-one/devops/pipeline-templates/base-image/harden-nodejs14:14.15.5


LABEL maintainer="tstockwell@tronaf.dev" 

WORKDIR /api

COPY . /api

EXPOSE 8080

RUN npm install

CMD ["/bin/bash", "/api/entrypoint.sh"]

