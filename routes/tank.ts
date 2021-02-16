import {Router, Request, Response} from 'express'
import query from '../prisma/query'
import {Tank} from '@prisma/client'

const router = Router()

// READ n ({aircraftid})
router.get('/', async (req: Request, res: Response) => {
  try {
    const aircraftid: number = req.body.aircraftid
    const reqRole: number = await query.readRoleAtAircraftID(req, aircraftid)

    if (reqRole >= 1) {
      const tanks = await query.readTanksAtAircraftId(aircraftid)
      res.status(200).send(tanks)
      // if role <1
    } else {
      res.status(403).send()
    }
  } catch (e) {
    console.log(e)
    res.status(500).send()
  }
})

// UPDATE || CREATE (Tank)
router.put('/', async (req: Request, res: Response) => {
  try {
    try {
      const reqBodyTank: Tank = req.body
      const reqRole: number = await query.readRoleAtAircraftID(
        req,
        reqBodyTank.aircraftid
      )

      if (reqRole >= 3) {
        await query.upsertTank(reqBodyTank)
        res.status(200).send()
        // if role <3
      } else {
        res.status(403).send()
      }
    } catch (e) {
      console.log(e)
      res.status(400).send('Name must be unique to aircraft')
    }
  } catch (e) {
    console.log(e)
    res.status(500).send()
  }
})

// DELETE Tank({tankid: x})
router.delete('/', async (req: Request, res: Response) => {
  try {
    const reqTankID = req.body.tankid
    const reqTank: Tank = await query.readTankAtTankID(reqTankID)
    const role = await query.readRoleAtAircraftID(req, reqTank.aircraftid)

    if (role >= 3) {
      await query.deleteTank(reqTankID)
      res.status(200).send()
    } else {
      res.status(403).send()
    }
  } catch (e) {
    console.log(e)
    res.status(500).send()
  }
})

export default router
