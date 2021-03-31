import {Router, Request, Response} from 'express'
import query from '../prisma/query'
import {baseRouter} from './baseRouter'

const tankRouter = Router()

// READ N ({aircraftId})
tankRouter.get('*', async (req: Request, res: Response) => {
  await baseRouter.getN({
    req: req,
    res: res,
    reqRoleGE: 1,
    readNAtPK: query.readTanksAtAircraftId,
  })
})

// UPDATE 1 || CREATE 1 (Tank)
tankRouter.put('/', async (req: Request, res: Response) => {
  await baseRouter.put1({
    req: req,
    res: res,
    reqRoleGE: 3,
    pk: 'tankId',
    readAircraftIDOfOBJpk: query.readAircraftIdAtTankid,
    upsertType: query.upsertTank,
  })
})

// DELETE 1 Tank ({tankId})
tankRouter.delete('*', async (req: Request, res: Response) => {
  await baseRouter.delete1({
    req: req,
    res: res,
    reqRoleGE: 3,
    objPK: 'tankId',
    delete1: query.deleteTank,
    readOBJatPK: query.readTankAtTankID,
  })
})

export default tankRouter
