FROM registry.il2.dso.mil/platform-one/devops/pipeline-templates/base-image/harden-nodejs14:14.16.0

# temporary fix until P1 adds chown capabilities or makes /home/node owned by appuser
USER root
RUN node -e "const fs = require('fs');  fs.chown('/home/node/', 950, 950, (error) => {console.log(error)});"
USER 950

# make dir to copy into
WORKDIR /app

# copy all 
COPY --chown=950:950 . .

# build prod files
RUN npx tsc

# document the port
EXPOSE 8080

# run the app
CMD ["/bin/bash", "/app/entrypoint.sh"]