import express, {Application} from 'express'
import compression from 'compression'
import aircraftRouter from './routes/aircraftRouter'
import generalRouter from './routes/generalRouter'
import userRouter from './routes/userRouter'
import glossaryRouter from './routes/glossaryRouter'
import tankRouter from './routes/tankRouter'
import cargoRouter from './routes/cargoRouter'
import configRouter from './routes/configRouter'
import configCargoRouter from './routes/configCargoRouter'
//import cors from 'cors';

const server: Application = express()
server.disable('x-powered-by')

server.use(express.json())
server.use(compression())
//server.use(cors())

server.use('/aircraft', aircraftRouter)
server.use('/general', generalRouter)
server.use('/user', userRouter)
server.use('/glossary', glossaryRouter)
server.use('/tank', tankRouter)
server.use('/cargo', cargoRouter)
server.use('/config', configRouter)
server.use('/configCargo', configCargoRouter)

server.listen(process.env.PORT)

export default server