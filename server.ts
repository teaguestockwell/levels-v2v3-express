
import express, {Application} from 'express';
import aircraftRouter from './routes/aircraftRouter';
import generalRouter from './routes/generalRouter';
import userRouter from './routes/userRouter'
import glossaryRouter from './routes/glossaryRouter'
import tankRouter from './routes/tankRouter'
import cargoRouter from './routes/cargoRouter'
import configRouter from './routes/configRouter'

const server: Application = express();

server.disable('x-powered-by')

server.use(express.json());
server.use('/aircraft', aircraftRouter);
server.use('/general', generalRouter);
server.use('/user', userRouter);
server.use('/glossary',glossaryRouter);
server.use('/tank',tankRouter);
server.use('/cargo',cargoRouter);
server.use('/config',configRouter);

const port = process.env.PORT || 8080
server.listen(port, () => console.log(`server listening on ${port}`))

export default server