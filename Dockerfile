#FROM node:14.15.4
FROM registry.il2.dso.mil/platform-one/devops/pipeline-templates/base-image/harden-nodejs14:14.16.0

WORKDIR /app

# temporary fix until P1 adds chown capabilities or makes /home/node owned by appuser
USER root
RUN node -e "const fs = require('fs');  fs.chown('/home/node/', 950, 950, (error) => {console.log(error)});"
USER 950

# COPY without dev env
COPY --chown=950:950 [^.env]* .

RUN npm install

EXPOSE 8080

CMD ["/bin/bash", "/app/entrypoint.sh"]