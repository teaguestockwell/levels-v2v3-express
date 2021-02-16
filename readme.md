##To build and run tests:

docker rm apiimg && docker build . -t api && docker run -p 8080:8080 --name apiimg api && docker exec -it apiimg bash

##To build or run test serprate from eachother,
comment out either npm run test || npm start in entrypoint.sh 
