import {Router, Request, Response} from 'express'
import service from '../../db/services'
const router = Router()
import {User} from '@prisma/client'

// post || put / upsert 
//1 user({role,email,aircraftid,userid?})
router.post('/', async (req: Request, res: Response) => {
  try {
    // when sending new user, make sure userid = 0
    const user: User = req.body

    if (
      await service.readIsReqRoleAtAircraftGreaterThan(
        req,
        user.role,
        user.aircraftid
      )
    ) {
      await service.upsertUser(user).then(() => res.status(200).send())

      // if the admin user does not have >= role on the aircraft they are tring to assign
    } else {
      res.status(403).send()
    }
  } catch (e) {
    console.log('Email must be unique to aircraft')
    res.status(400).send('Email must be unique to aircraft')
  }
})

// get
// n users({aircraftid}) // if no body returns all airs
router.get('/', async (req: Request, res: Response) => {
  try {
    if ((await service.readHighestRole(req)) >= 2) {
      const aircraftid: number = req.body.aircraftid

      await service
        .readUsersAtAircraftID(aircraftid)
        .then((users) => res.status(200).json(users))

      // not authorized to view roles
    } else {
      res.status(403).send()
    }
  } catch (e) {
    console.log(e)
    res.status(500).send()
  }
})

// delete
// 1 user(userid)
router.delete('/', async (req: Request, res: Response) => {
  try {
    const userid = req.body.userid
    const tryDeleteUser = await service.readUserAtUserID(userid)
    const reqUser = await service.readUserAtReqAndAircraftId(
      req,
      tryDeleteUser.aircraftid
    )
    if (reqUser.role > tryDeleteUser.role) {
      service.deleteUserAtUserid(tryDeleteUser.userid)
      res.status(200).send()
    } else {
      res.status(403).send()
    }
  } catch (e) {
    console.log(e)
    res.status(500).send()
  }
})

export default router
