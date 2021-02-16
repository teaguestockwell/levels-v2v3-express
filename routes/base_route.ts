/* eslint-disable @typescript-eslint/no-explicit-any */ import query from '../prisma/query'
import {Request, Response} from 'express'

interface getN {
  req: Request
  res: Response
  reqRoleGE: number
  bodyIDPara?: string
  // log?: boolean
  readNAtAirID: (id: number) => Promise<any[]>
}

interface put1 {
  req: Request
  res: Response
  reqRoleGE: number
  //log?: boolean
  upsertType: (obg: any) => Promise<void>
}

interface delete1 {
  objPK: string
  req: Request
  res: Response
  reqRoleGE: number
  //log?: boolean
  delete1: (pk: any) => Promise<void>
  readOBJatPK: (pk: number) => Promise<any>
}

export const baseRoute = {
  getN: async ({
    req,
    res,
    reqRoleGE,
    readNAtAirID,
    //log = false,
  }: getN): Promise<void> => {
    try {
      const id: number = req.body.aircraftid
      const roleAtAircraft: number = await query.readRoleAtAircraftID(req, id)

      if (roleAtAircraft >= reqRoleGE) {
        const n: any[] = await readNAtAirID(id)
        // if (log) {
        //   console.log(`sent 200 length: ${n.length}`)
        // }
        res.status(200).send(n)
      } else {
        // if (log) {
        //   console.log(`req with role: ${roleAtAircraft} denyed`)
        // }
        res
          .status(403)
          .send({msg: `You need a role of at least ${reqRoleGE} to do that`})
      }
    } catch (e) {
      // if (log) {
      //   console.log(e)
      // }
      res.status(500).send({
        msg: 'We cant do that right now. Please refresh the previous screen',
      })
    }
  },

  put1: async ({
    req,
    res,
    reqRoleGE,
    //log = false,
    upsertType,
  }: put1): Promise<void> => {
    try {
      try {
        const obj: any = req.body
        const roleAtAircraft: number = await query.readRoleAtAircraftID(
          req,
          obj.aircraftid
        )
        if (roleAtAircraft >= reqRoleGE) {
          await upsertType(obj)
          // if (log) {
          //   console.log(`sent 200, obj upserted`)
          // }
          res.status(200).send()
        } else {
          // if (log) {
          //   console.log(`req with role: ${roleAtAircraft} denyed`)
          // }
          res
            .status(403)
            .send({msg: `You need a role of at least ${reqRoleGE} to do that`})
        }
      } catch (e) {
        // if (log) {
        //   console.log(e)
        // }
        res.status(400).send('Name / title must be unique to aircraft')
      }
    } catch (e) {
      // if (log) {
      //   console.log(e)
      // }
      res.status(500).send({
        msg: 'We cant do that right now. Please refresh the previous screen',
      })
    }
  },

  delete1: async ({
    req,
    res,
    reqRoleGE,
    //log = false,
    delete1,
    readOBJatPK,
    objPK,
  }: delete1): Promise<void> => {
    try {
      const pk = req.body[objPK]
      const obj: any = await readOBJatPK(pk)
      const reqRoleAtOBJ = await query.readRoleAtAircraftID(req, obj.aircraftid)

      if (reqRoleAtOBJ >= reqRoleGE) {
        await delete1(pk)
        // if (log) {
        //   console.log(`sent 200, obj deleted`)
        // }
        res.status(200).send()
      } else {
        // if (log) {
        //   console.log(`req with role: ${reqRoleAtOBJ} denyed`)
        // }
        res
          .status(403)
          .send({msg: `You need a role of at least ${reqRoleGE} to do that`})
      }
    } catch (e) {
      // if (log) {
      //   console.log(e)
      // }
      res.status(500).send()
    }
  },
}
