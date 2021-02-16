import {Router, Request, Response} from 'express'
import query from '../prisma/query'
import {baseRoute} from './base_route'

const router = Router()

// READ N ({aircraftid})
router.get('/', async (req: Request, res: Response) => {
  await baseRoute.getN({
    req: req,
    res: res,
    reqRoleGE: 1,
    readNAtAirID: query.readTanksAtAircraftId
  })
})

// UPDATE 1 || CREATE 1 (Tank)
router.put('/', async (req: Request, res: Response) => {
  await baseRoute.put1({
    req: req,
    res: res,
    reqRoleGE: 3,
    upsertType: query.upsertTank
  })
})

// DELETE 1 Tank ({tankid})
router.delete('/', async (req: Request, res: Response) => {
  await baseRoute.delete1({
    req: req,
    res: res,
    reqRoleGE: 3,
    objPK: 'tankid',
    delete1: query.deleteTank,
    readOBJatPK: query.readTankAtTankID,
  })
})

export const tankRouter = router
