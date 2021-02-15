
import express, {Application} from 'express';
import aircraftRouter from './routes/aircraft';
import generalRouter from './routes/general';
import userRouter from './routes/user'
import glossaryRouter from './routes/glossary'
const app: Application = express();


app.set('port', process.env.PORT || 8080);

app.use(express.json());
app.use('/aircraft', aircraftRouter);
app.use('/general', generalRouter);
app.use('/user', userRouter);
app.use('/glossary',glossaryRouter);

app.listen(app.get('port'), () => console.log(`1 listening on ${app.get('port')}`))

export default app