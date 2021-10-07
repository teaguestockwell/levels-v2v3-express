# stage 1
FROM node:14.16.0

# make dir to copy into
WORKDIR /app

# copy all but node modules
COPY . .

ENTRYPOINT ["npm","run","test:unit"]
