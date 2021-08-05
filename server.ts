import express, {Application} from 'express'
import compression from 'compression'
import aircraftRouter from './routes/aircraftRouter'
import userRouter from './routes/userRouter'
import glossaryRouter from './routes/glossaryRouter'
import tankRouter from './routes/tankRouter'
import cargoRouter from './routes/cargoRouter'
import configRouter from './routes/configRouter'
import configCargoRouter from './routes/configCargoRouter'
import logRouter from './routes/logRouter'
import responseTime from 'response-time'
import errorHandler from './middleware/errorHandler'
import logger from './middleware/logger'
import methodsWhitelist from './middleware/methodsWhitelist'
import cors from 'cors'

const server: Application = express()

// rm header
server.disable('x-powered-by')

// use middleware
server.use(express.json())
server.use(responseTime())
server.use(methodsWhitelist)
server.use(errorHandler)
server.use(logger)
server.use(cors())
server.use(compression())

// use route middleware
server.use('/log', logRouter)
server.use('/aircraft', aircraftRouter)
server.use('/user', userRouter)
server.use('/glossary', glossaryRouter)
server.use('/tank', tankRouter)
server.use('/cargo', cargoRouter)
server.use('/config', configRouter)
server.use('/configCargo', configCargoRouter)

server.listen(process.env.PORT)

export default server
