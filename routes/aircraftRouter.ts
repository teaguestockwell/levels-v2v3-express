import query from '../prisma/query'
import {Router, Request, Response} from 'express'
import {Aircraft, User} from '@prisma/client'
import {resMsg} from './baseRouter'
const aircraftRouter = Router()

// READ ()
aircraftRouter.get('/', async (req: Request, res: Response) => {
  try {
    // faster to read all data, and sort it then to make many request to db
    // also more flexible than writing nested query
    const allAirsMap = await query.readAircraftsAsMap()

    // roles > 0 of requester are allowed to view aircraft data
    const airids: number[] = await query.readAllAircraftIDsOfRoleWhereRoleGreaterThanX(
      req, // used to lookup users email
      0 // roles > 0 have role 1 @ aircraft
    )

    const ret: Aircraft[] = []

    // fill ret[] from map
    airids.forEach((id) => ret.push(allAirsMap.get(id)))

    resMsg.on200(req)
    res.status(200).send(ret)
  } catch (e) {
    res.status(500).send(resMsg.on500(req, e))
  }
})

// UPDATE || CREATE (Aircraft)
aircraftRouter.put('/', async (req: Request, res: Response) => {
  try {
    const reqAir: Aircraft = req.body
    const highestRole = await query.readHighestRole(req)

    if (reqAir.id == 0 && highestRole >= 3) {
      const reqEmail = query.readEmail(req)

      // we have asserted that this req has a role >= 3 on some aircraft,
      // so we can grab a copy of that to pass to the new aircraft
      const reqUser = await query.readFirstUserAtEmail(reqEmail)

      // they should be able to create users with role 3
      reqUser.role = 4

      try {
        await query.upsertAircraftShallow(reqAir, reqUser)
        res.status(200).send(resMsg.on200(req))
      } catch (e) {
        res.status(400).send(resMsg.on400(req))
      }
    }

    // UPDATE
    else if ((await query.readRoleAtAircraftID(req, reqAir.id)) >= 3) {
      try {
        const mockUser: User = {
          aircraftid: 0,
          role: 0,
          email: 'mock',
          userid: 0,
        }
        await query.upsertAircraftShallow(reqAir, mockUser)
        res.status(200).send(resMsg.on200(req))
      } catch (e) {
        res.status(400).send(resMsg.on400(req))
      }
    } else {
      const role = await query.readRoleAtAircraftID(req, reqAir.id)
      res.status(403).send(resMsg.on403(3, role, req))
    }
  } catch (e) {
    res.status(500).send(resMsg.on500(req, e))
  }
})

// DELETE ({id})
aircraftRouter.delete('/', async (req: Request, res: Response) => {
  try {
    const id: number = req.body.id
    const roleAtAir = await query.readRoleAtAircraftID(req, id)

    if (roleAtAir > 2) {
      await query.deleteAircraft(id) // recursive delete to all nested relashionships
      res.status(200).send(resMsg.on200(req))
    } else {
      res.status(403).send(resMsg.on403(2, roleAtAir, req))
    }
  } catch (e) {
    res.status(500).send(resMsg.on500(req, e))
  }
})

export default aircraftRouter
