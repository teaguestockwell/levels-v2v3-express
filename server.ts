
import express, {Application} from 'express';
import aircraftRouter from './routes/aircraft';
import generalRouter from './routes/general';
const app: Application = express();


app.set('port', process.env.PORT || 8080);

app.use(express.json());
app.use('/aircraft', aircraftRouter);
app.use('/general', generalRouter);

app.listen(app.get('port'), () => console.log(`listening on ${app.get('port')}`))

module.exports = app;