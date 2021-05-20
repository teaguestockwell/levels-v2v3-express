import query from '../prisma/query'
import {Router, Request, Response} from 'express'
import {Aircraft, User} from '@prisma/client'

const aircraftRouter = Router()
// READ ()
aircraftRouter.get('/', async (req: Request, res: Response) => {
  try {
    res.status(200).send(await query.readAirsAtReq(req, 0))
  } catch (e) {
    res.status(500).send()
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
    res.status(500).send()
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
        res.status(200).json()
      } catch (e) {
        res.status(400).send()
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
        res.status(200).send()
      } catch (e) {
        res.status(400).send()
      }
    } else {
      res.status(403).send()
    }
  } catch (e) {
    res.status(500).send()
  }
})

// DELETE ({aircraftId})
aircraftRouter.delete('*', async (req: Request, res: Response) => {
  try {
    const roleGE = 3
    try{

      const aircraftId = Number(req.query['aircraftId'])
      const user = await query.readUserAtReqAndAircraftId(req, aircraftId)
      
      if (user.role >= roleGE) {
        await query.deleteAircraft(aircraftId) // recursive delete to all nested relationships
        res.status(200).send()
    } else {
      res.status(403).send()
    }
  } catch (e) {
    res.status(400).send()
  }
  } catch (e) {
    res.status(500).send()
  }
})

export default aircraftRouter
