import {Router, Request, Response} from 'express'
import query from '../prisma/query'
import {User} from '@prisma/client'
import { msg } from './baseRouter'

const userRouter = Router()

// READ ({aircraftid}) || ()
userRouter.get('/', async (req: Request, res: Response) => {
  try {
    const aircraftid: number = req.body.aircraftid
    if ((await query.readHighestRole(req)) >= 2) {
      const users = await query.readUsersAtAircraftID(aircraftid)
      msg.on200(req)
      res.status(200).send(users)
    } else {
      const role = await query.readHighestRole(req)
      res.status(403).send(msg.on403(2,role,req))
    }
  } catch (e) {
    res.status(500).send(msg.on500(req,e))
  }
})

// UPDATE || CREATE (User)
userRouter.put('/', async (req: Request, res: Response) => {
  try {
    const reqBodyUser: User = req.body
    const reqUser: User = await query.readUserAtReqAndAircraftId(
      req,
      reqBodyUser.aircraftid
    )

    if (reqUser.role >= 2 && reqUser.role > reqBodyUser.role) {
      await query.upsertUser(reqBodyUser)
      res.status(200).send(msg.on200(req))
    } else {
      res.status(403).send(msg.on403(2,reqUser.role,req))
    }
  } catch (e) {
    res.status(400).send(msg.on400(req))
  }
})

// DELETE ({userid})
userRouter.delete('/', async (req: Request, res: Response) => {
  try {
    const userid = req.body.userid
    const tryDeleteUser = await query.readUserAtUserID(userid)
    const reqUser = await query.readUserAtReqAndAircraftId(
      req,
      tryDeleteUser.aircraftid
    )
    if (reqUser.role > tryDeleteUser.role) {
      query.deleteUserAtUserid(tryDeleteUser.userid)
      res.status(200).send(msg.on200(req))
    } else {
      res.status(403).send(msg.on403(tryDeleteUser.role+1,reqUser.role,req))
    }
  } catch (e) {
    console.log(e)
    res.status(500).send()
  }
})

export default userRouter
