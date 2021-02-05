import { Router, Request, Response } from 'express'
import service from './../db/services'
const router  = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    let role = await service.readRole(req)

    let general = await service.readGeneral(role)

    res.status(200).send(general)
    
    console.log('/general called and sent 200')
  }
  catch (error) {
    res.status(500).send("oops")
  }
})

export default router;