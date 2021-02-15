import {Router, Request, Response} from 'express'
import query from '../prisma/query'
import {Glossary} from '@prisma/client'

const router = Router()

// CREATE (Glossary)
router.post('/', async (req: Request, res: Response) => {
  try{
    try {
      const reqBodyGlossary: Glossary = req.body
      const reqRole: number = await query.readRoleAtAircraftID(req,reqBodyGlossary.aircraftid)

      if (reqRole >= 3) {
        await query.createGlossary(reqBodyGlossary)
        res.status(200).send()
        // if role <3
      } else {
        res.status(403).send()
      }
    } catch (e) {
      console.log('Title must be unique to aircraft')
      res.status(400).send('Title must be unique to aircraft')
    }
  } catch (e) {
    console.log(e)
    res.status(500).send()
  }
})

// READ n ({aircraftid})
router.get('/', async (req:Request, res:Response) => {
  try {
    const aircraftid:number = req.body.aircraftid
    const reqRole: number = await query.readRoleAtAircraftID(req,aircraftid)

    if (reqRole >= 1) {
      const glossarys = await query.readGlossarysAtAircraftId(aircraftid)
      res.status(200).send(glossarys)
      // if role <1
    } else {
      res.status(403).send()
    }
  } catch (e) {
    console.log(e)
    res.status(500).send()
  }
})

// UPDATE (Glossary)
router.put('/', async (req: Request, res: Response) => {
  try{
    try {
      const reqBodyGlossary: Glossary = req.body
      const reqRole: number = await query.readRoleAtAircraftID(req,reqBodyGlossary.aircraftid)

      if (reqRole >= 3) {
        await query.updateGlossary(reqBodyGlossary)
        res.status(200).send()
        // if role <3
      } else {
        res.status(403).send()
      }
    } catch (e) {
      console.log('Title must be unique to aircraft')
      res.status(400).send('Title must be unique to aircraft')
    }
  } catch (e) {
    console.log(e)
    res.status(500).send()
  }
})

// DELETE Glossary({glossaryid: x})
router.delete('/', async (req:Request, res:Response) => {
  try{
    const reqGlossaryID = req.body.glossaryid
    const reqGlossary: Glossary = await query.readGlossaryAtGlossaryID(reqGlossaryID)
    const role = await query.readRoleAtAircraftID(req,reqGlossary.aircraftid)

    if(role >=3){
      await query.deleteGlossary(reqGlossaryID)
      res.status(200).send()
    }else{
      res.status(403).send()
    }
  }catch(e){
    console.log(e)
    res.status(500).send()
  }
})

export default router