import service from './../db/services'
import {Router, Request, Response} from 'express'
import {Aircraft} from '@prisma/client'
const router = Router()

// the aircraft route is the main endpoint that the ui will request for
// a user role of that applicaiton. It will read the users auth object in pg,
// and return all the aircraft object are associated with it
router.get('/', async (req: Request, res: Response) => {
  console.log('/aircraft called')
  try {
    
    // faster to read all data, and sort it then to make many request to db
    // also more flexible than writing nested query
    const allAirsMap = await service.readAircraftsAsMap()
    
    // roles > 0 of requester are allowed to view aircraft data
    const airids: number[] = await service.readAllAircraftIDsOfRoleWhereRoleGreaterThanX(
      req, // used to lookup users email
      0 // roles > 0 have role 1 @ aircraft
      )
      
    const ret: Aircraft[] = []

    // fill ret[] from map
    airids.forEach((id) => ret.push(allAirsMap.get(id)))

    res.status(200).send(ret)

  } catch (error) {
    console.log(error)
    res.status(500).send('oops')
  }
})

export default router
