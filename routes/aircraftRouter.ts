import {query} from '../prisma/query'
import {Router, Request, Response} from 'express'
import { localMemCache } from '../prisma/localMemCache'
import _ from 'lodash'

const aircraftRouter = Router()

const allAirMap = async () => {
  return (await query.readAircrafts()).reduce((prev,curr) => {
    prev[curr.aircraftId] = curr
    return prev
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }, {} as any)
}

const getAllowedShallowAndDeep = (req: any) => Promise.all([
  query.readAirsAtReqShallow(req, 0),
  localMemCache({
    fallback: allAirMap,
    key: 'allAircraftMap'
  })
])

// READ ()
aircraftRouter.get('/', async (req: Request, res: Response) => {
  try {
    res.status(200).json(await query.readAirsAtReqShallow(req, 0))
  } catch (e) {
    res.status(500).json()
  }
})

aircraftRouter.get('/client-server-sync', async (req: Request, res: Response) =>{
  try {
    if(req.query){
      const [allowedShallow, deep] = await getAllowedShallowAndDeep(req)

      // get the memoized hash hash of each aircraft the requester has access to
      // {[key: number as aircraftId]: string as deepHashId}
      const dataState = {} as any
      allowedShallow.forEach(a => dataState[a.aircraftId] = deep[a.aircraftId]?.deepHasshId)

      res.status(200).json({
        isClientSyncedWithServer: _.isEqual(dataState, req.query),
        serverEpoch: Date.now(),
        dataState
      })

    } else { 
      res.status(400).json()
    }
  } catch (e) {
    res.status(500).json()
  }
})

aircraftRouter.get('/lastUpdated', async (req: Request, res: Response) => {

  try {
    const [allowedShallow, deep] = await getAllowedShallowAndDeep(req)
    
    // get the memoized hash hash of each aircraft the requester has access to
    const dataState = {} as any
    allowedShallow.forEach(a => dataState[a.aircraftId] = deep[a.aircraftId]?.deepHashId)
    
    // for each allowed shallow aircraft, return the cached deep one
    const data = allowedShallow.map(allowed => deep[allowed.aircraftId])

    res.status(200).json({
      serverEpoch: Date.now(),
      data,
      dataState
    })
  } catch (e) {
    console.error(e)
    res.status(500).json()
  }
})

// UPDATE || CREATE (Aircraft)
aircraftRouter.put('/', async (req: Request, res: Response) => {
  try {
    req.body.updatedBy = query.readName(req)
    req.body.updated = new Date()
    const roleGE = 3
    const reqAir = req.body
    const user = await query.readUserWithHighestRole(req)

    if (reqAir.aircraftId === 0 && user.role >= roleGE) {
      // they should be able to create users with role 3
      user.role = 4

      try {
        await query.upsertAircraftShallow(reqAir, user)
        res.status(200).json()
      } catch (e) {
        res.status(400).json()
      }
    }

    // UPDATE
    else if ((await query.readRoleAtAircraftId(req, reqAir.aircraftId)) >= 3) {
      try {
        await query.upsertAircraftShallow(reqAir, user)
        res.status(200).json()
      } catch (e) {
        res.status(400).json()
      }
    } else {
      res.status(403).json()
    }
  } catch (e) {
    res.status(500).json()
  }
})

// DELETE ({aircraftId})
aircraftRouter.delete('*', async (req: Request, res: Response) => {
  try {
    const roleGE = 3
    try {
      const aircraftId = Number(req.query['aircraftId'])
      const user = await query.readUserAtReqAndAircraftId(req, aircraftId)

      if (user.role >= roleGE) {
        await query.deleteAircraft(aircraftId) // recursive delete to all nested relationships
        res.status(200).json()
      } else {
        res.status(403).json()
      }
    } catch (e) {
      res.status(403).json()
    }
  } catch (e) {
    res.status(500).json()
  }
})

export default aircraftRouter
