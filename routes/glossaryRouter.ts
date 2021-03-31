import {Router, Request, Response} from 'express'
import query from '../prisma/query'
import {baseRouter} from './baseRouter'

const glossaryRouter = Router()

// READ N ({aircraftId})
glossaryRouter.get('*', async (req: Request, res: Response) => {
  await baseRouter.getN({
    req: req,
    res: res,
    reqRoleGE: 1,
    readNAtPK: query.readGlossarysAtAircraftId,
  })
})

// UPDATE 1 || CREATE 1 (Glossary)
glossaryRouter.put('/', async (req: Request, res: Response) => {
  baseRouter.put1({
    req: req,
    res: res,
    reqRoleGE: 3,
    pk: 'glossaryId',
    readAircraftIDOfOBJpk: query.readAircraftIdAtGlossaryid,
    upsertType: query.upsertGlossary,
  })
})

// DELETE 1 Glossary ({glossaryId})
glossaryRouter.delete('*', async (req: Request, res: Response) => {
  await baseRouter.delete1({
    req: req,
    res: res,
    reqRoleGE: 3,
    objPK: 'glossaryId',
    delete1: query.deleteGlossary,
    readOBJatPK: query.readGlossartAtGlossaryId,
  })
})

export default glossaryRouter
