# A REST API with auth using Prisma-Express-Node-PGSql

A node server leveraging:

1. Express
2. Prisma
3. Postgresql
4. Typescript
5. User roles
6. Nested models

![output](https://user-images.githubusercontent.com/71202372/112101303-a4edc080-8b63-11eb-9712-97a42599a66d.gif)
![output](https://user-images.githubusercontent.com/71202372/112105405-986c6680-8b69-11eb-9c34-b60b4aff17e6.gif)

# Required dependencies

1. install git https://www.atlassian.com/git/tutorials/install-git
2. install docker: https://docs.docker.com/get-docker/
3. install vscode: https://code.visualstudio.com/download
4. install the vs code extension: https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers

# To compose UI-API-DB
 
#### Mac

git clone https://code.il2.dso.mil/tron/products/five-level-app/frontend.git frontend && git clone https://code.il2.dso.mil/tron/products/five-level-app/api.git api && git clone https://code.il2.dso.mil/tron/products/five-level-app/docker-compose-dev.git fullstack-template && cd fullstack-template && bin/run.sh

#### Windows

git clone https://code.il2.dso.mil/tron/products/five-level-app/frontend.git frontend && git clone https://code.il2.dso.mil/tron/products/five-level-app/api.git api && git clone https://code.il2.dso.mil/tron/products/five-level-app/docker-compose-dev.git fullstack-template && cd fullstack-template && bin/run.ps1

# Setup your dev env

1. click on green button that looks like this in bottom left of vs code ><
2. click open workspace in container
3. code stuff && profit?

# What the heck is a fullstack template?

BSwenson made a tool that mock the P1 env locally by injecting an auth header. This allows us to create roles and profiles for users authenticated with P1's Keycloak: https://code.il2.dso.mil/brandon.swenson/fullstack-template

to view live data while running, use the examples with vs code rest client || attach terminal to running api container and run: npx prisma studio

### Postgresql img out of space on mac?

1. https://github.com/docker/for-mac/issues/371#issuecomment-248404423
2. reset docker to factory defaults
3. docker pull nginx && docker pull node:14.15.4 && docker pull nginx


