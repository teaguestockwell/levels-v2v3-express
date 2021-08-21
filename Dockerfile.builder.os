# this dockerfile creates an optimed production build without development dependancies

# stage 1
FROM node:16 as builder

# make dir to copy into
WORKDIR /app

# copy all
COPY . .

# this is a bulder stage, so we need typescript as dev dependency
ENV NODE_ENV development

# download some packages
RUN npm install

# create type orms from schema incase post install hook fails
RUN npx prisma generate

# build prod files
RUN npx tsc --outDir ./build

# stage 2
FROM node:16 

# make dir to copy into
WORKDIR /app

# copy the js build
COPY --from=builder /app/build .

# files that are not js need to be copied in since they are not  in ./build
COPY --from=builder /app/package.json .
COPY --from=builder /app/package-lock.json .
COPY --from=builder /app/entrypoint.sh .
COPY --from=builder /app/prisma/schema.prisma ./prisma
COPY --from=builder /app/prisma/migrations ./prisma/migrations

# dont install dev packages
ENV NODE_ENV production

# install prod packages
RUN npm install

# document the port
EXPOSE 8080

# run the app
CMD ["/bin/bash", "/app/entrypoint.sh"]