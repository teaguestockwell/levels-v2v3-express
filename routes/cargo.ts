import {Router, Request, Response} from 'express'
import query from '../prisma/query'
import {Cargo} from '@prisma/client'

const router = Router()

// READ n ({aircraftid})
router.get('/', async (req: Request, res: Response) => {
  try {
    const aircraftid: number = req.body.aircraftid
    const reqRole: number = await query.readRoleAtAircraftID(req, aircraftid)

    if (reqRole >= 1) {
      const cargos = await query.readCargosAtAircraftId(aircraftid)
      res.status(200).send(cargos)
      // if role <1
    } else {
      res.status(403).send()
    }
  } catch (e) {
    console.log(e)
    res.status(500).send()
  }
})

// UPDATE || CREATE (Cargo)
router.put('/', async (req: Request, res: Response) => {
  try {
    try {
      const reqBodyCargo: Cargo = req.body
      const reqRole: number = await query.readRoleAtAircraftID(
        req,
        reqBodyCargo.aircraftid
      )

      if (reqRole >= 3) {
        await query.upsertCargo(reqBodyCargo)
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

// DELETE Cargo({cargoid: x})
router.delete('/', async (req: Request, res: Response) => {
  try {
    const reqCargoID = req.body.cargoid
    const reqCargo: Cargo = await query.readCargoAtCargoID(reqCargoID)
    const role = await query.readRoleAtAircraftID(req, reqCargo.aircraftid)

    if (role >= 3) {
      await query.deleteCargo(reqCargoID)
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