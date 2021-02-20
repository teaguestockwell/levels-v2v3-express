#FROM node:14.15.4
FROM registry.il2.dso.mil/platform-one/devops/pipeline-templates/harden-nodejs-12-18-3:8.2.276

WORKDIR /api

COPY . /api

EXPOSE 8080

RUN npm install

CMD ["/bin/bash", "/api/entrypoint.sh"]

