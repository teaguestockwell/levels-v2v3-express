import {Router, Request, Response} from 'express'
import query from '../prisma/query'
import {User} from '@prisma/client'

const userRouter = Router()

// READ
userRouter.get('/', async (req: Request, res: Response) => {
  console.log('GET /user called on api')
  try {
    const aircraftid: number = req.body.aircraftid
    if ((await query.readHighestRole(req)) >= 2) {
      await query.readUsersAtAircraftID(aircraftid)
        .then((users) => res.status(200).send(users))
    } else {
      res.status(403).send({msg: `You need a role of at least 2 to do that`})
    }
  } catch (e) {
    console.log(e)
    res.status(500).send({
      msg: 'We cant do that right now. Please refresh the previous screen',
    })
  }
})

// UPDATE || CREATE
userRouter.put('/', async (req: Request, res: Response) => {
  try {
    const reqBodyUser: User = req.body
    const reqUser: User = await query.readUserAtReqAndAircraftId(
      req,
      reqBodyUser.aircraftid
    )

    if (reqUser.role >= 2 && reqUser.role > reqBodyUser.role) {
      await query.upsertUser(reqBodyUser).then(() => res.status(200).send())

      // if the admin user does not have >= role on the aircraft they are tring to assign
    } else {
      res.status(403).send({msg: `You need a role of at least 2 and a role greater than ${reqBodyUser.role} to do that. Your role is: ${reqUser.role}`})
    }
  } catch (e) {
    console.log('Email must be unique to aircraft')
    res.status(400).send('Email must be unique to aircraft')
  }
})

// DELETE
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
      res.status(200).send()
    } else {
      res.status(403).send()
    }
  } catch (e) {
    console.log(e)
    res.status(500).send()
  }
})

export default userRouter
