import {General} from '@prisma/client'
import {Router, Request, Response} from 'express'
import query from '../prisma/query'
const generalRouter = Router()

// the general route is used to authenticate users against the
// auth table in postgresql, once the role is found from the table,
// the api will send a general object to the ui.

// for example, the home screen will display different buttons that allow
// admin users to perform crud ops on a users auth object

// READ 1 ()
generalRouter.get('/', async (req: Request, res: Response) => {
  try {
    const role = await query.readHighestRole(req)
    const general = await query.readGeneral(role)
    res.status(200).send(general)
  } catch (e) {
    res.status(500).send()
  }
})

// UPDATE || CREATE (General)
generalRouter.put('/', async (req: Request, res: Response) => {
  try {
    const reqBodyGeneral: General = req.body
    const reqUserHighestRole: number = await query.readHighestRole(req)

    if (reqUserHighestRole >= 5) {
      await query.upsertGeneral(reqBodyGeneral)
      res.status(200).send()
    } else {
      res.status(403).send()
    }
  } catch (e) {
    res.status(500).send()
  }
})

// DELETE ({role})
generalRouter.delete('*', async (req: Request, res: Response) => {
  try {
    const role = await query.readHighestRole(req)
    const generalid = Number(`${req.query['role']}`)
    if (role >= 5) {
      query.deleteGeneral(generalid)
      res.status(200).send()
    } else {
      res.status(403).send()
    }
  } catch (e) {
    res.status(500).send()
  }
})

export default generalRouter
