
import express, {Application} from 'express';
import aircraftRouter from './routes/aircraft';
import generalRouter from './routes/general';
import userRouter from './routes/user'
import glossaryRouter from './routes/glossary'
import tankRouter from './routes/tank'
import cargoRouter from './routes/cargo'
const app: Application = express();


app.set('port', process.env.PORT || 8080);

app.use(express.json());
app.use('/aircraft', aircraftRouter);
app.use('/general', generalRouter);
app.use('/user', userRouter);
app.use('/glossary',glossaryRouter);
app.use('/tank',tankRouter);
app.use('/cargo',cargoRouter);

app.listen(app.get('port'), () => console.log(`2 listening on ${app.get('port')}`))

export default app