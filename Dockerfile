# stage 1
FROM registry.il2.dso.mil/platform-one/devops/pipeline-templates/base-image/harden-nodejs14:14.16.0 as builder

# make dir to copy into
WORKDIR /app

# temporary fix until P1 adds chown capabilities or makes /home/node owned by appuser
USER root
RUN node -e "const fs = require('fs');  fs.chown('/home/node/', 950, 950, (error) => {console.log(error)});"
USER 950

# copy all but node modules
COPY --chown=950:950 . .

# this is a bulder stage, so we need typescript as dev dependency
ENV NODE_ENV development

# download some packages
RUN npm install

# create type orms from schema incase post install hook fails
RUN npx prisma generate

# build prod files
RUN npx tsc

# stage 2
FROM registry.il2.dso.mil/platform-one/devops/pipeline-templates/base-image/harden-nodejs14:14.16.0

# temporary fix until P1 adds chown capabilities or makes /home/node owned by appuser
USER root
RUN node -e "const fs = require('fs');  fs.chown('/home/node/', 950, 950, (error) => {console.log(error)});"
USER 950

# make dir to copy into
WORKDIR /app

# copy the js build
COPY --from=0 /app/build .

# files that are not js need to be copied in since they are not  in ./build
COPY --from=0 /app/package.json .
COPY --from=0 /app/package-lock.json .
COPY --from=0 /app/entrypoint.sh .
COPY --from=0 /app/prisma/schema.prisma ./prisma
COPY --from=0 /app/prisma/migrations ./prisma/migrations

# dont install dev packages
ENV NODE_ENV production

# install prod packages
RUN npm install

# document the port
EXPOSE 8080

# run the app
CMD ["/bin/bash", "/app/entrypoint.sh"]