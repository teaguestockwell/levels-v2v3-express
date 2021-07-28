import {Router, Request, Response} from 'express'
import {query} from '../prisma/query'
import {User} from '@prisma/client'

const userRouter = Router()

// READ ({aircraftId}) || ()
userRouter.get('*', async (req: Request, res: Response) => {
  try {
    const roleGE = 2
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
  req.body.updatedBy = query.readName(req)
  req.body.updated = new Date()
  try {
    const maxRole = 100
    const minRol = 0
    const reqUser: User = await query.readUserAtReqAndAircraftId(
      req,
      req.body.aircraftId
    )

    const roleGE =
      reqUser.role >= 2
        ? // users with role >= 2 may update users with role <= self.role
          req.body.role
        : // users with role 1 cannot update
          99

    if (req.body.role > maxRole || req.body.role < minRol) {
      res.status(400).json()
      return
    }

    // try to find the user that the req is trying to modify
    const reqBodyUser = await query.readUserAtName_AircraftId(
      req.body.name,
      req.body.aircraftId
    )

    // if the reqBody user was found,
    if (reqBodyUser) {
      // make sure that req users role >= the user they are trying to update
      if (reqBodyUser.role <= reqUser.role && reqUser.role >= roleGE) {
        try {
          await query.upsertUser(req.body)
          res.status(200).json()
          return
        } catch (e) {
          res.status(400).json(e)
          return
        }
      } else {
        res.status(403).json()
        return
      }
    }

    // if the reqBody is a new user
    if (reqUser.role >= roleGE) {
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
