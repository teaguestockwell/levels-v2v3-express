import {Router, Request, Response} from 'express'
import { query }from '../prisma/query'
import {baseRouter} from './baseRouter'

const configCargoRouter = Router()

// READ N (Config)
configCargoRouter.get('*', async (req: Request, res: Response) => {
  const roleGE = 1
  try {
    try {
      const pkNum = Number(req.query.configId)
      const verifidAirId = await query.readAircraftIdAtConfigid(pkNum)
      // to mitigate role exploitation, verify the aircraft aircraftId given the obj pk.
      // an example of where this is applicable is GET /configcargo
      const user = await query.readUserAtReqAndAircraftId(req, verifidAirId)

      if (user.role >= roleGE) {
        // using the nested cargo, insert a name prop into configcargo
        res.status(200).json(
          (await query.readConfigCargosDeepAtConfigId(pkNum)).map((x) => {
            x['name'] = x['cargo']['name']
            return x
          })
        )
      } else {
        res.status(403).json()
      }
    } catch (e) {
      res.status(400).json()
    }
  } catch (e) {
    res.status(500).json()
  }
})

// UPDATE 1 || CREATE 1 (ConfigCargo)
configCargoRouter.put('/', async (req: Request, res: Response) => {
  await baseRouter.put1({
    req,
    res,
    roleGE: 3,
    pk: 'configCargoId',
    readAircraftIDOfOBJpk: query.readAircraftIdAtConfigCargoid,
    upsertType: query.upsertConfigCargoShallow,
  })
})

// DELETE 1 ConfigCargo({configCargoId})
configCargoRouter.delete('*', async (req: Request, res: Response) => {
  await baseRouter.delete1({
    req,
    res,
    objPK: 'configCargoId',
    roleGE: 3,
    delete1: query.deleteConfigCargo,
    readOBJatPK: query.readConfigCargoAtConfigCargoId,
  })
})

export default configCargoRouter
