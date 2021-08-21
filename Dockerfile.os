FROM node:16

# make dir to copy into
WORKDIR /app

# copy all 
COPY . .

# build prod files
RUN npx tsc

# document the port
EXPOSE 8080

# run the app
CMD ["/bin/bash", "/app/entrypoint.sh"]