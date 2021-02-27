##To build and run tests:

docker rm apiimg && docker build . -t api && docker run -p 8080:8080 --name apiimg api && docker exec -it apiimg bash

To compose localy using the docker-compose-dev / fullstack template, create a .env in the local dir with the folloing contents:

PORT=8080
DATABASE_URL="postgresql://fl_admin_user:password@database:5432"

Then point the fullstack templates .env to the front and backend docker files