'use strict';

const express = require('express');
const app = express();

const cors = require('cors')
const aircraft = require('./routes/aircraft');
//const general = require('./routes/general');

app.set('port', process.env.port || 8000);
app.use(express.json());

app.set('port', process.env.port || 8000);
app.use(express.json());
app.use(cors());

app.use('/aircraft', aircraft);
//app.use('/general', general);

app.listen(app.get('port'), () => console.log(`listening on ${app.get('port')}`))

module.exports = app;