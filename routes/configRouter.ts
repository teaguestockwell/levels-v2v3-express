import {Router, Request, Response} from 'express'
import query from '../prisma/query'
import {baseRouter} from './baseRouter'

const configRouter = Router()

// READ N ({aircraftId})
configRouter.get('*', async (req: Request, res: Response) => {
  await baseRouter.getN({
    req: req,
    res: res,
    reqRoleGE: 1,
    readNAtPK: query.readConfigsDeepAtAircraftId,
  })
})

// UPDATE 1 || CREATE 1 (Config)
configRouter.put('/', async (req: Request, res: Response) => {
  await baseRouter.put1({
    req: req,
    res: res,
    reqRoleGE: 3,
    pk: 'configId',
    readAircraftIDOfOBJpk: query.readAircraftIdAtConfigid,
    upsertType: query.upsertConfigShallow,
  })
})

// DELETE 1 Cargo({configId})
configRouter.delete('*', async (req: Request, res: Response) => {
  await baseRouter.delete1({
    req: req,
    res: res,
    objPK: 'configId',
    reqRoleGE: 3,
    delete1: query.deleteConfig,
    readOBJatPK: query.readConfigAtConfigId,
  })
})

export default configRouter
