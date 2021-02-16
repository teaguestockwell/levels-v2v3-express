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
    readNAtAirID: query.readCargosAtAircraftId
  })
})

// UPDATE 1 || CREATE 1 (Cargo)
router.put('/', async (req: Request, res: Response) => {
  await baseRoute.put1({
    req:req,
    res:res,
    reqRoleGE: 3,
    upsertType: query.upsertCargo
  })
})

// DELETE 1 Cargo({cargoid})
router.delete('/', async (req: Request, res: Response) => {
  await baseRoute.delete1({
    req: req,
    res: res,
    objPK: 'cargoid',
    reqRoleGE: 3,
    delete1: query.deleteCargo,
    readOBJatPK: query.readCargoAtCargoID,
  })
})

export const cargoRouter = router