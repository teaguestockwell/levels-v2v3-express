import {Router, Request, Response} from 'express'
import query from '../prisma/query'
import {baseRoute} from './base_route'

const router = Router()

// READ N ({aircraftid})
router.get('/', async (req:Request, res:Response) => {
  await baseRoute.getN({
    req: req,
    res: res,
    reqRoleGE: 1,
    readNAtAirID: query.readGlossarysAtAircraftId
  })
})

// UPDATE 1 || CREATE 1 (Glossary)
router.put('/', async (req: Request, res: Response) => {
  baseRoute.put1({
    req: req,
    res: res,
    upsertType: query.upsertGlossary,
    reqRoleGE: 3
  })
})

// DELETE 1 Glossary ({glossaryid})
router.delete('/', async (req:Request, res:Response) => {
  await baseRoute.delete1({
    req: req,
    res: res,
    reqRoleGE: 3,
    objPK: 'glossaryid',
    delete1: query.deleteGlossary,
    readOBJatPK: query.readGlossartAtGlossaryId
  })
})

export const glossaryRouter = router