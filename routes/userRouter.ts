import {Router, Request, Response} from 'express'
import query from '../prisma/query'
import {User} from '@prisma/client'
import { sendWrapped, sendWrapped500 } from './baseRouter'

const userRouter = Router()

// READ ({aircraftId}) || ()
userRouter.get('*', async (req: Request, res: Response) => {
  try {
    const roleGE = 2
    try{
      const user = await query.readUserWithHighestRole(req)
      const aircraftId = Number(`${req.query['aircraftId']}`)
      if (user.role >= roleGE) {
        sendWrapped({
          user,
          req,
          res,
          status: 200,
          resBody: await query.readUsersAtAircraftId(aircraftId),
          roleGE
        })
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
    sendWrapped({
      req,
      res,
      status: 400,
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

// UPDATE || CREATE (User)
userRouter.put('/', async (req: Request, res: Response) => {
  try {
    const reqUser: User = await query.readUserAtReqAndAircraftId(
      req,
      req.body.aircraftId
    )
    const roleGE = req.body.role > 2 ? req.body.role + 1 : 2
    if (reqUser.role >= roleGE) {
      try{
        await query.upsertUser(req.body)
        sendWrapped({
          user: reqUser,
          req,
          res,
          status: 200,
          roleGE
        })
      } catch (e) {
        sendWrapped({
          user: reqUser,
          req,
          res,
          status: 400,
          roleGE
        })
      }
    } else {
      sendWrapped({
        user: reqUser,
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

// DELETE ({userId})
userRouter.delete('*', async (req: Request, res: Response) => {
  try {
    try{
      const tryDeleteUser = await query.readUserAtUserId(Number(`${req.query['userId']}`))
      const reqUser = await query.readUserAtReqAndAircraftId(
        req,
        tryDeleteUser.aircraftId
        )
        
        if (reqUser.role > tryDeleteUser.role) {
          query.deleteUserAtUserid(tryDeleteUser.userId)
          sendWrapped({
            user: reqUser,
            req,
            res,
            status: 200,
        roleGE: tryDeleteUser.role
      })
    } else {
      sendWrapped({
        user: reqUser,
        req,
        res,
        status: 403,
        roleGE: tryDeleteUser.role + 1
      })
    }
  } catch (e) {
    sendWrapped({
      req,
      res,
      status: 400,
      roleGE: -1
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

export default userRouter
