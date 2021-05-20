import {Router, Request, Response} from 'express'
import query from '../prisma/query'
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
  try {
    const reqUser: User = await query.readUserAtReqAndAircraftId(
      req,
      req.body.aircraftId
    )
    const roleGE = req.body.role > 2 ? req.body.role + 1 : 2
    if (reqUser.role >= roleGE) {
      try {
        await query.upsertUser(req.body)
        res.status(200).json()
      } catch (e) {
        res.status(400).json()
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

      if (reqUser.role > tryDeleteUser.role) {
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
