import {Router, Request, Response} from 'express'
import {query} from '../prisma/query'
import {User} from '@prisma/client'

const userRouter = Router()

// READ ({aircraftId}) || ()
userRouter.get('*', async (req: Request, res: Response) => {
  try {
    const roleGE = 1
    try {
      const user = await query.readUserWithHighestRole(req)
      const aircraftId = Number(`${req.query['aircraftId']}`)
      if (user.role >= roleGE) {
        res.status(200).json(await query.readUsersAtAircraftId(aircraftId))
      } else {
        res.status(403).json()
      }
    } catch (e) {
      res.status(400).json()
    }
  } catch (e) {
    res.status(500).json()
  }
})

// UPDATE || CREATE (User)
userRouter.put('/', async (req: Request, res: Response) => {
  try {
    req.body.updatedBy = query.readName(req)
    req.body.updated = new Date()

    if (req.body.role > 100 || req.body.role < 0) {
      res.status(400).json()
    }

    const reqUser: User = await query.readUserAtReqAndAircraftId(
      req,
      req.body.aircraftId
    )

    const isReqUserAdmin = reqUser.role >= 2
    
    const isReqUserRoleGTEUpsertRole = reqUser.role >= req.body.role
      
    // try to find the user that the req is trying to modify
    const reqBodyUser = await query.readUserAtName_AircraftId(
      req.body.name,
      req.body.aircraftId
    )
    
    // if no existing user is found the requesters user is GTE
    const isReqUserRoleGTEReqBodyUserRole = reqBodyUser ? reqUser.role >= reqBodyUser.role : true 

    // if the reqBody is a new user
    if (isReqUserAdmin && isReqUserRoleGTEUpsertRole && isReqUserRoleGTEReqBodyUserRole) {
      try {
        await query.upsertUser(req.body)
        res.status(200).json()
      } catch (e) {
        res.status(400).json(e)
      }
    } else {
      res.status(403).json()
    }

  } catch (e) {
    res.status(500).json()
  }
})

// DELETE ({userId})
userRouter.delete('*', async (req: Request, res: Response) => {
  try {
    try {
      const tryDeleteUser = await query.readUserAtUserId(
        Number(`${req.query['userId']}`)
      )
      const reqUser = await query.readUserAtReqAndAircraftId(
        req,
        tryDeleteUser.aircraftId
      )

      if (reqUser.role >= tryDeleteUser.role) {
        query.deleteUserAtUserid(tryDeleteUser.userId)
        res.status(200).json()
      } else {
        res.status(403).json()
      }
    } catch (e) {
      res.status(400).json()
    }
  } catch (e) {
    res.status(500).json()
  }
})

export default userRouter
