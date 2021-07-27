import {Router, Request, Response} from 'express'
import {query} from '../prisma/query'
import {baseRouter} from './baseRouter'

const cargoRouter = Router()

// READ N ({aircraftId})
cargoRouter.get('*', async (req: Request, res: Response) => {
  await baseRouter.getN({
    req,
    res,
    roleGE: 1,
    readNAtPK: query.readCargosAtAircraftId,
  })
})

// UPDATE 1 || CREATE 1 (Cargo)
cargoRouter.put('/', async (req: Request, res: Response) => {
  req.body.updatedBy = query.readName(req)
  req.body.updated = new Date(Date.now())
  await baseRouter.put1({
    req,
    res,
    roleGE: 3,
    pk: 'cargoId',
    readAircraftIDOfOBJpk: query.readAircraftIdAtCargoid,
    upsertType: query.upsertCargo,
  })
})

// DELETE 1 Cargo({cargoId})
cargoRouter.delete('/', async (req: Request, res: Response) => {
  await baseRouter.delete1({
    req,
    res,
    objPK: 'cargoId',
    roleGE: 3,
    delete1: query.deleteCargo,
    readOBJatPK: query.readCargoAtCargoId,
  })
})

export default cargoRouter
