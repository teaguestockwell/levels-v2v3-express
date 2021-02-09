import service from './../db/services'
import { Router, Request, Response } from 'express'
const router  = Router();

// the aircraft route is the main endpoint that the ui will request for 
// a user role of that applicaiton. It will read the users auth object in pg,
// and return all the aircraft object are associated with it
router.get('/', async (req: Request, res: Response) => {
  try {

    //TODO: implement role base aircraft[] return
    
    //let role = await services.getRole(req)

    const airs = await service.readAircrafts(req)
    res.status(200).send(airs)
    console.log('/aircraft called and sent 200')
  }
  catch (error) {
    console.log(error)
    res.status(500).send("oops")
  }
})

export default router;

