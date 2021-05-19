import query from '../prisma/query'
import {Router, Request, Response} from 'express'
import {Aircraft, User} from '@prisma/client'
import { sendWrapped, sendWrapped500 } from './baseRouter'
const aircraftRouter = Router()

// READ ()
aircraftRouter.get('/', async (req: Request, res: Response) => {
  try {
    res.status(200).send(
      await query.readAirsAtReq(req, 0)
    )
  } catch (e) {
    sendWrapped500({
      req,
      res,
      e
    })
  }
})

aircraftRouter.get('/lastUpdated', async (req: Request, res: Response) => {
  try {
    res.status(200).send(
      {
        serverEpoch: Date.now(),
        data: await query.readAirsAtReq(req, 0)
      }
    )
  } catch (e) {
    sendWrapped500({
      req,
      res,
      e
    })
  }
})

// UPDATE || CREATE (Aircraft)
aircraftRouter.put('/', async (req: Request, res: Response) => {
  const roleGE = 3
  try {
    const reqAir: Aircraft = req.body
    const user = await query.readUserWithHighestRole(req)
    
    if (reqAir.aircraftId === 0 && user.role >= roleGE) {
      // they should be able to create users with role 3
      user.role = 4

      try {
        await query.upsertAircraftShallow(reqAir, user)
        sendWrapped({
          user,
          req,
          res,
          status: 200,
          roleGE: 3
        })
      } catch (e) {
        sendWrapped({
          user,
          req,
          res,
          status: 400,
          roleGE
        })
      }
    }

    // UPDATE
    else if ((await query.readRoleAtAircraftId(req, reqAir.aircraftId)) >= 3) {
      try {
        const mockUser: User = {
          aircraftId: 0,
          role: 0,
          name: 'mock',
          userId: 0,
        }
        await query.upsertAircraftShallow(reqAir, mockUser)
        sendWrapped({
          user,
          req,
          res,
          status: 200,
          roleGE
        })
      } catch (e) {
        sendWrapped({
          req,
          res,
          status: 400,
          roleGE
        })
      }
    } else {

      sendWrapped({
        user,
        req,
        res,
        status: 403,
        roleGE
      })
    }
  } catch (e) {
    sendWrapped500({
      req,
      res,
      e
    })
  }
})

// DELETE ({aircraftId})
aircraftRouter.delete('*', async (req: Request, res: Response) => {
  try {
    const aircraftId = Number(`${req.query['aircraftId']}`)
    const user = await query.readUserAtReqAndAircraftId(req, aircraftId)

    if (user.role >= 3) {
      await query.deleteAircraft(aircraftId) // recursive delete to all nested relationships
      sendWrapped({
        user,
        req,
        res,
        status: 200,
        roleGE: 3
      })
    } else {
      sendWrapped({
        user,
        req,
        res,
        status: 403,
        roleGE: 3
      })
    }
  } catch (e) {
    sendWrapped500({
      req,
      res,
      e
    })
  }
})

export default aircraftRouter
