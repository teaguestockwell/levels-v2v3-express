import {Router, Request, Response} from 'express'
import query from '../prisma/query'
import {baseRouter} from './baseRouter'

const configCargoRouter = Router()

// READ N (Config)
configCargoRouter.get('/', async (req: Request, res: Response) => {
  await baseRouter.getN({
    req: req,
    res: res,
    reqRoleGE: 1,
    pk: 'configid',
    readNAtPK: query.readConfigCargosDeepAtConfigId,
  })
})

// UPDATE 1 || CREATE 1 (ConfigCargo)
configCargoRouter.put('/', async (req: Request, res: Response) => {
  await baseRouter.put1({
    req: req,
    res: res,
    reqRoleGE: 3,
    upsertType: query.upsertConfigCargoShallow,
  })
})

// DELETE 1 ConfigCargo({configcargoid})
configCargoRouter.delete('/', async (req: Request, res: Response) => {
  await baseRouter.delete1({
    req: req,
    res: res,
    objPK: 'configcargoid',
    reqRoleGE: 3,
    delete1: query.deleteConfigCargo,
    readOBJatPK: query.readConfigCargoAtConfigCargoId,
  })
})

export default configCargoRouter
