import service from './../db/services'
import { Router, Request, Response } from 'express'
const router  = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    //let role = await services.getRole(req)

    let airs = await service.readAircrafts(req)
    res.status(200).send(airs)
    console.log('/aircraft called and sent 200')
  }
  catch (error) {
    console.log(error)
    res.status(500).send("oops")
  }
})

export default router;

