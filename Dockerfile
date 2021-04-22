#FROM node:14.15.4
FROM registry.il2.dso.mil/platform-one/devops/pipeline-templates/base-image/harden-nodejs14:14.16.0 as build

WORKDIR /app

# temporary fix until P1 adds chown capabilities or makes /home/node owned by appuser
USER root
RUN node -e "const fs = require('fs');  fs.chown('/home/node/', 950, 950, (error) => {console.log(error)});"
USER 950

COPY --chown=950:950 server.ts ./
COPY --chown=950:950 wait.ts ./
COPY --chown=950:950 package.json ./
COPY --chown=950:950 package-lock.json ./
COPY --chown=950:950 entrypoint.sh ./
COPY --chown=950:950 routes ./routes
COPY --chown=950:950 prisma ./prisma

RUN npm install

EXPOSE 8080

CMD ["/bin/bash", "/app/entrypoint.sh"]