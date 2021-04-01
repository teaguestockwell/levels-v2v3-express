import {Router, Request, Response} from 'express'
import query from '../prisma/query'
import {baseRouter, resMsg} from './baseRouter'

const configCargoRouter = Router()

// READ N (Config)
configCargoRouter.get('*', async (req: Request, res: Response) => {
  const reqRoleGE = 1
  const pk = 'configId'
  const readAircraftIDOfOBJpk = query.readAircraftIdAtConfigid
  const readNAtPK = query.readConfigCargosDeepAtConfigId
  try {
    const pkNum = Number(`${req.query[pk]}`)

    // to mitigate role explotation, verify the aircraft aircraftId given the obj pk.
    // an example of where this is applicable is GET /configcargo
    const verifiedAirId = await readAircraftIDOfOBJpk(pkNum)
    const roleAtAircraft = await query.readRoleAtAircraftID(req, verifiedAirId)

    if (roleAtAircraft >= reqRoleGE) {
      const n = await readNAtPK(pkNum)

      // using the nested cargo, insert a name prop into configcargo
      const nx = n.map((x) => {
        x['name'] = x['cargo']['name']
        return x
      })
      resMsg.on200(req)
      res.status(200).send(nx)
    } else {
      res.status(403).send(resMsg.on403(reqRoleGE, roleAtAircraft, req))
    }
  } catch (e) {
    res.status(500).send(resMsg.on500(req, e))
  }
})

// UPDATE 1 || CREATE 1 (ConfigCargo)
configCargoRouter.put('/', async (req: Request, res: Response) => {
  await baseRouter.put1({
    req: req,
    res: res,
    reqRoleGE: 3,
    pk: 'configcargoid',
    readAircraftIDOfOBJpk: query.readAircraftIdAtConfigCargoid,
    upsertType: query.upsertConfigCargoShallow,
  })
})

// DELETE 1 ConfigCargo({configcargoid})
configCargoRouter.delete('*', async (req: Request, res: Response) => {
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
