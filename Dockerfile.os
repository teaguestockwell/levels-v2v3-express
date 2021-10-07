FROM node:14.16.0

# make dir to copy into
WORKDIR /app

# copy all 
COPY . .

RUN npm install

# build prod files
RUN npx tsc

# document the port
EXPOSE 8080

# run the app
CMD ["/bin/bash", "/app/entrypoint.sh"]