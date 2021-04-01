import {Router, Request, Response} from 'express'
import query from '../prisma/query'
import {User} from '@prisma/client'
import {resMsg} from './baseRouter'

const userRouter = Router()

// READ ({aircraftId}) || ()
userRouter.get('*', async (req: Request, res: Response) => {
  try {
    const aircraftId = Number(`${req.query['aircraftId']}`)
    if ((await query.readHighestRole(req)) >= 2) {
      const users = await query.readUsersAtAircraftId(aircraftId)
      resMsg.on200(req)
      res.status(200).send(users)
    } else {
      const role = await query.readHighestRole(req)
      res.status(403).send(resMsg.on403(2, role, req))
    }
  } catch (e) {
    res.status(500).send(resMsg.on500(req, e))
  }
})

// UPDATE || CREATE (User)
userRouter.put('/', async (req: Request, res: Response) => {
  try {
    const reqBodyUser: User = req.body
    const reqUser: User = await query.readUserAtReqAndAircraftId(
      req,
      reqBodyUser.aircraftId
    )

    if (reqUser.role >= 2 && reqUser.role > reqBodyUser.role) {
      await query.upsertUser(reqBodyUser)
      res.status(200).send(resMsg.on200(req))
    } else {
      res.status(403).send(resMsg.on403(reqBodyUser.role, reqUser.role, req))
    }
  } catch (e) {
    res.status(400).send(resMsg.on400(req))
  }
})

// DELETE ({userId})
userRouter.delete('*', async (req: Request, res: Response) => {
  try {
    const userId = Number(`${req.query['userId']}`)
    const tryDeleteUser = await query.readUserAtUserId(userId)
    const reqUser = await query.readUserAtReqAndAircraftId(
      req,
      tryDeleteUser.aircraftId
    )
    if (reqUser.role > tryDeleteUser.role) {
      query.deleteUserAtUserid(tryDeleteUser.userId)
      res.status(200).send(resMsg.on200(req))
    } else {
      res
        .status(403)
        .send(resMsg.on403(tryDeleteUser.role + 1, reqUser.role, req))
    }
  } catch (e) {
    console.log(e)
    res.status(500).send()
  }
})

export default userRouter
