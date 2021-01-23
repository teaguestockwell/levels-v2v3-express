require('dotenv').config()
const express = require('express')
const app = express()
// const mongoose = require('mongoose')

//set port for api
app.set('port', process.env.PORT || 8000);
app.use(express.json());

//connect to db
// mongoose.connect(process.env.DATABASE_URL, { useUnifiedTopology: true })
// const db = mongoose.connection

// db.on('error', (error) => console.error(error))
// db.once('open', () => console.log('connnected to db'))
app.listen(app.get('port'), ()=>{console.log('server started ')}) 