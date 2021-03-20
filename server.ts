import express, {Application} from 'express'
import compression from 'compression'
import aircraftRouter from './routes/aircraftRouter'
import generalRouter from './routes/generalRouter'
import userRouter from './routes/userRouter'
import glossaryRouter from './routes/glossaryRouter'
import tankRouter from './routes/tankRouter'
import cargoRouter from './routes/cargoRouter'
import configRouter from './routes/configRouter'
import configCargoRouter from './routes/configcargoRouter'
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
server.use('/configcargo', configCargoRouter)

const port = process.env.PORT || 8080
console.log(`Database URL: ${process.env.DATABASE_URL}`)
server.listen(port, () => console.log(`server listening on ${port}`))

export default server
