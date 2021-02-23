#FROM node:14.15.4
FROM registry.il2.dso.mil/platform-one/devops/pipeline-templates/harden-nodejs-12-18-3:8.2.276

WORKDIR /api

# temporary fix until P1 adds chown capabilities or makes /home/node owned by appuser
USER root
RUN node -e "const fs = require('fs');  fs.chown('/home/node/', 950, 950, (error) => {console.log(error)});"
USER 950

COPY . /api

EXPOSE 8080

RUN npm install

CMD ["/bin/bash", "/api/entrypoint.sh"]

