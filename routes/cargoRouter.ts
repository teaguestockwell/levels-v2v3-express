import {Router, Request, Response} from 'express'
import query from '../prisma/query'
import {baseRouter} from './baseRouter'

const cargoRouter = Router()

// READ N ({aircraftid})
cargoRouter.get('/', async (req: Request, res: Response) => {
  await baseRouter.getN({
    req: req,
    res: res,
    reqRoleGE: 1,
    readNAtPK: query.readCargosAtAircraftId,
  })
})

// UPDATE 1 || CREATE 1 (Cargo)
cargoRouter.put('/', async (req: Request, res: Response) => {
  await baseRouter.put1({
    req: req,
    res: res,
    reqRoleGE: 3,
    pk: 'cargoid',
    readAircraftIDOfOBJpk: query.readAircraftIdAtCargoid,
    upsertType: query.upsertCargo,
  })
})

// DELETE 1 Cargo({cargoid})
cargoRouter.delete('/', async (req: Request, res: Response) => {
  await baseRouter.delete1({
    req: req,
    res: res,
    objPK: 'cargoid',
    reqRoleGE: 3,
    delete1: query.deleteCargo,
    readOBJatPK: query.readCargoAtCargoID,
  })
})

export default cargoRouter
