require('dotenv').config()
const express = require('express')
const cors = require('cors')
app.use(cors())
const app = express()

//set port for api
app.set('port', process.env.PORT || 8000);
app.use(express.json());

var 

app.get('/', function (req, res) {
  console.log('hi express')
  res.send(
    {
      id: 'hello frmo your api',




    }




  )
})


// db.on('error', (error) => console.error(error))
// db.once('open', () => console.log('connnected to db'))
app.listen(app.get('port'), ()=>{console.log('server started ')}) 