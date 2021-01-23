docker rm apiimg && docker build . -t api && docker run -p 8080:8080 --name apiimg api && docker exec -it apiimg bash


todo:

api key cloak auth


seed init data into pg

api json reads from pg

parse reads into json

Flutter http request to api for json => 
  api auth of dodid => return list of auth json to flutter

how can I have admins seed new data into pg?

  flutter request admin modify => api auth => api read all pg => api parse into excel => api return execl to user?

  no excel, front end ui send request to api to edit pg?

  no pg? excel parser and return excel to admin user?

  









