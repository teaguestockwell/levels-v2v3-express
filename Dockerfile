#FROM node:14.15.4
FROM registry.il2.dso.mil/platform-one/devops/pipeline-templates/base-image/harden-nodejs14:14.16.0

WORKDIR /app

# COPY without dev env
COPY . [^.env]*.

RUN npm install

EXPOSE 8080

CMD ["/bin/bash", "/app/entrypoint.sh"]