import {Router, Request, Response} from 'express'
import query from '../prisma/query'
import {baseRouter} from './baseRouter'

const tankRouter = Router()

// READ N ({aircraftid})
tankRouter.get('/', async (req: Request, res: Response) => {
  await baseRouter.getN({
    req: req,
    res: res,
    reqRoleGE: 1,
    readNAtAirID: query.readTanksAtAircraftId
  })
})

// UPDATE 1 || CREATE 1 (Tank)
tankRouter.put('/', async (req: Request, res: Response) => {
  await baseRouter.put1({
    req: req,
    res: res,
    reqRoleGE: 3,
    upsertType: query.upsertTank
  })
})

// DELETE 1 Tank ({tankid})
tankRouter.delete('/', async (req: Request, res: Response) => {
  await baseRouter.delete1({
    req: req,
    res: res,
    reqRoleGE: 3,
    objPK: 'tankid',
    delete1: query.deleteTank,
    readOBJatPK: query.readTankAtTankID,
  })
})

export default tankRouter
