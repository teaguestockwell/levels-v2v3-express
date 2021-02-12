import query from '../prisma/query'
import {Router, Request, Response} from 'express'
import {Aircraft} from '@prisma/client'
const router = Router()

// the aircraft route is the main endpoint that the ui will request for
// a user role of that applicaiton. It will read the users auth object in pg,
// and return all the aircraft object are associated with it

// POST / create
router.post('/', async (req: Request, res: Response) => {
  console.log('POST /aircraft EP')
  try {
    const highestRole = await query.readHighestRole(req)
    if (highestRole >= 3) {
      try{
        await query.createAircraftShallow(req.body)
        res.status(200).send()
      }catch(e){
        res.status(400).send()
      }
    } else {
      res.status(403).send()
    }
  } catch (e) {
    res.status(500).send()
  }
})

// GET / READ
router.get('/', async (req: Request, res: Response) => {
  console.log('GET /aircraft EP')
  try {
    // faster to read all data, and sort it then to make many request to db
    // also more flexible than writing nested query
    const allAirsMap = await query.readAircraftsAsMap()
    
    // roles > 0 of requester are allowed to view aircraft data
    const airids: number[] = await query.readAllAircraftIDsOfRoleWhereRoleGreaterThanX(
      req, // used to lookup users email
      0 // roles > 0 have role 1 @ aircraft
      )
      
      const ret: Aircraft[] = []
      
    // fill ret[] from map
    airids.forEach((id) => ret.push(allAirsMap.get(id)))
    
    console.log(`${ret.length} aircraft sent`)
    
    res.status(200).send(ret)
  } catch (error) {
    console.log(error)
    res.status(500).send('oops')
  }
})

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id)
    console.log('get id: '+ id)
    
    const role = await query.readRoleAtAircraftID(req, id)
    
    if (role >= 2) {
      const ret = await query.readAircraftAtID(id)
      res.status(200).send(ret)
    } else {
      res.status(403).send()
    }
  } catch (error) {
    console.log(error)
    res.status(500).send('oops')
  }
})

// PUT / UPDATE
router.put('/', async (req: Request, res: Response) => {
  console.log('PUT /aircraft EP')
  try {
    const role = await query.readRoleAtAircraftID(req,req.body.id)
    if (role >= 3) {
      try{
        await query.updateAircraftShallow(req.body)
        res.status(200).send()
      }catch(e){
        res.status(400).send()
      }
    } else {
      res.status(403).send()
    }
  } catch (e) {
    res.status(500).send()
  }
})

//DELETE
router.delete('/:id', async (req: Request, res: Response) => {
  console.log('DELETE /aircraft EP')
  try {
    const id: number = parseInt(req.params.id)
    console.log(`/aircraft/${id}`)

    const roleAtAir = await query.readRoleAtAircraftID(req, id)

    if (roleAtAir > 2) {
      await query.deleteAircraft(id) // recursive delete to all nested relashionships
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
