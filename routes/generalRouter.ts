import {Router, Request, Response} from 'express'
import query from '../prisma/query'
const generalRouter = Router()

// the general route is used to authenticate users agains the
// auth table in postgress, once the role is found from the table,
// the api will send a general object to the ui.

// for example, the home screen will diplay diffrent buttons that allow
// admin users to perform crud ops on a users auth object

// READ 1 ()
generalRouter.get('/', async (req: Request, res: Response) => {
  try {
    const role = await query.readHighestRole(req)
    console.log(role)
    const general = await query.readGeneral(role)
    console.log(general.toString())
    res.status(200).send(general)
  } catch (error) {
    res.status(500).send()
  }
})

export default generalRouter
