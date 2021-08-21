# stage 1
FROM node:16

# make dir to copy into
WORKDIR /app

# copy all but node modules
COPY . .

ENTRYPOINT ["npm","run","test:unit"]
