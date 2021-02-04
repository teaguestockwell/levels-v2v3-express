
import express, {Application, Request, Response} from 'express';
import aircraft, {router}  from './routes/aircraft';
const app: Application = express();

//const aircraft = require('./routes/aircraft');
//const general = require('./routes/general');

app.set('port', process.env.PORT || 8080);
app.use(express.json());

app.use('/aircraft', aircraft);
app.use('/general', general);

app.listen(app.get('port'), () => console.log(`listening on ${app.get('port')}`))

module.exports = app;