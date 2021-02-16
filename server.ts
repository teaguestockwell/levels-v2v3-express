
import express, {Application} from 'express';
import aircraftRouter from './routes/aircraftRouter';
import generalRouter from './routes/generalRouter';
import userRouter from './routes/userRouter'
import glossaryRouter from './routes/glossaryRouter'
import tankRouter from './routes/tankRouter'
import cargoRouter from './routes/cargoRouter'
const server: Application = express();

server.disable('x-powered-by')
server.set('port', process.env.PORT || 8080);

server.use(express.json());
server.use('/aircraft', aircraftRouter);
server.use('/general', generalRouter);
server.use('/user', userRouter);
server.use('/glossary',glossaryRouter);
server.use('/tank',tankRouter);
server.use('/cargo',cargoRouter);

server.listen(server.get('port'), () => console.log(`2 listening on ${server.get('port')}`))

export default server