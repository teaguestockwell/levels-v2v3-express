/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import query from '../prisma/query'
import {Request, Response} from 'express'

interface getN {
  req: Request
  res: Response
  reqRoleGE: number
  bodyIDPara?: string
  pk?: string
  readNAtPK: (id: number) => Promise<any[]>
  readAircraftIDOfOBJpk?: (obj: number) => Promise<number>
}

interface put1 {
  req: Request
  res: Response
  reqRoleGE: number
  pk?: string
  readAircraftIDOfOBJpk?: (obj: number) => Promise<number>
  upsertType: (obg: any) => Promise<void>
}

interface delete1 {
  objPK: string
  req: Request
  res: Response
  reqRoleGE: number
  delete1: (pk: any) => Promise<void>
  readOBJatPK: (pk: number) => Promise<any>
}

interface msgI {
  msg: string
}
export const resMsg = {
  on200: (req: Request): msgI => {
    const msg = {msg: `200: ${req.method} @ ${req.originalUrl}`}
    console.log(msg.msg)
    return msg
  },

  on400: (req: Request): msgI => {
    const msg = {
      msg: `400: Name / name must be unique to ${req.method} @ ${req.originalUrl}`,
    }
    console.log(msg.msg)
    return msg
  },

  on403: (reqRoleGE: number, reqRole: number, req: Request): msgI => {
    const msg = {
      msg: `403: Role greater or equal to ${reqRoleGE} needed to ${req.method} @ ${req.originalUrl}. Your role is ${reqRole}`,
    }
    console.log(msg.msg)
    return msg
  },

  on500: (req: Request, e: Error): msgI => {
    const msg = {
      msg: `500: We cant ${req.method} @ ${req.originalUrl}. Please refresh the previous screen`,
    }
    console.log(msg.msg)
    console.log(e)
    return msg
  },
}
// TODO: add 400 res for request that dont have aircraft aircraftId / pk
export const baseRouter = {
  getN: async ({
    req,
    res,
    reqRoleGE,
    pk = 'aircraftId',
    readNAtPK,
    readAircraftIDOfOBJpk,
  }: getN): Promise<void> => {
    try {
      const pkNum = Number(`${req.query[pk]}`)
      let roleAtAircraft: number

      // to mitigate role explotation, verify the aircraft aircraftId given the obj pk.
      // an example of where this is applicable is GET /configcargo
      // if the pk is aircraft aircraftId this is unnecacary
      if (pk != 'aircraftId') {
        const verifiedAirId = await readAircraftIDOfOBJpk(pkNum)
        roleAtAircraft = await query.readRoleAtAircraftID(req, verifiedAirId)
      } else {
        roleAtAircraft = await query.readRoleAtAircraftID(
          req,
          Number(`${req.query['aircraftId']}`)
        )
      }

      if (roleAtAircraft >= reqRoleGE) {
        const n: any[] = await readNAtPK(pkNum)
        resMsg.on200(req)
        res.status(200).send(n)
      } else {
        res.status(403).send(resMsg.on403(reqRoleGE, roleAtAircraft, req))
      }
    } catch (e) {
      res.status(500).send(resMsg.on500(req, e))
    }
  },

  put1: async ({
    req,
    res,
    reqRoleGE,
    pk = 'aircraftId',
    upsertType,
    readAircraftIDOfOBJpk,
  }: put1): Promise<void> => {
    try {
      try {
        const pkNum: number = req.body[pk]
        const obj: any = req.body
        let roleAtAircraft: number

        // because this is a create or update ep and a pkNum of 0 is a create req,
        // we dont need to check the role @ an object that has not been created yet
        if (pk != 'aircraftId' && pkNum != 0) {
          const verifiedAirId = await readAircraftIDOfOBJpk(pkNum)
          roleAtAircraft = await query.readRoleAtAircraftID(req, verifiedAirId)
        } else {
          roleAtAircraft = await query.readRoleAtAircraftID(
            req,
            req.body.aircraftId
          )
        }

        if (roleAtAircraft >= reqRoleGE) {
          await upsertType(obj)
          res.status(200).send(resMsg.on200(req))
        } else {
          res.status(403).send(resMsg.on403(reqRoleGE, roleAtAircraft, req))
        }
      } catch (e) {
        res.status(400).send(resMsg.on400(req))
      }
    } catch (e) {
      res.status(500).send(resMsg.on500(req, e))
    }
  },

  delete1: async ({
    req,
    res,
    reqRoleGE,
    delete1,
    readOBJatPK,
    objPK,
  }: delete1): Promise<void> => {
    try {
      const pk = Number(`${req.query[objPK]}`)
      const obj: any = await readOBJatPK(pk)
      const reqRoleAtOBJ = await query.readRoleAtAircraftID(req, obj.aircraftId)

      if (reqRoleAtOBJ >= reqRoleGE) {
        await delete1(pk)
        res.status(200).send(resMsg.on200(req))
      } else {
        res.status(403).send(resMsg.on403(reqRoleGE, reqRoleAtOBJ, req))
      }
    } catch (e) {
      res.status(500).send(resMsg.on500(req, e))
    }
  },
}
