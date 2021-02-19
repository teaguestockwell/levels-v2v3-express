/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import query from '../prisma/query'
import {Request, Response} from 'express'

interface getN {
  req: Request
  res: Response
  reqRoleGE: number
  bodyIDPara?: string
  readNAtAirID: (id: number) => Promise<any[]>
}

interface put1 {
  req: Request
  res: Response
  reqRoleGE: number
  upsertType: (obg: any) => Promise<void>
}

interface delete1 {
  objPK: string
  req: Request
  res: Response
  reqRoleGE: number
  delete1: (pk:any) => Promise<void>
  readOBJatPK: (pk:number) => Promise<any>
}

interface msg {
  msg:string
}
export const msg ={
  on200: (req:Request):msg =>{
    const msg = {msg:`200: ${req.method} @ ${req.originalUrl}`}
    console.log(msg.msg)
    return msg
  },

  on400: (req:Request):msg =>{
    const msg = {msg: `400: Name / title must be unique to ${req.method} @ ${req.originalUrl}`}
    console.log(msg.msg)
    return msg
  },

  on403: (reqRoleGE:number, reqRole:number, req:Request):msg =>{
    const msg = {msg: `403: Role greater or equal to ${reqRoleGE} needed to ${req.method} @ ${req.originalUrl}. Your role is ${reqRole}`}
    console.log(msg.msg)
    return msg
  },


  on500: (req:Request, e:Error):msg =>{
    const msg = {msg: `500: We cant ${req.method} @ ${req.originalUrl}. Please refresh the previous screen`}
    console.log(msg.msg)
    console.log(e)
    return msg
  },
}
// TODO: add 400 res for request that dont have aircraft id / pk
export const baseRouter = {
  getN: async ({
    req,
    res,
    reqRoleGE,
    readNAtAirID,
  }: getN): Promise<void> => {
    try {
      const id: number = req.body.aircraftid
      const roleAtAircraft: number = await query.readRoleAtAircraftID(req, id)

      if (roleAtAircraft >= reqRoleGE) {
        const n: any[] = await readNAtAirID(id)
        msg.on200(req)
        res.status(200).send(n)
      } else {
        res
          .status(403)
          .send(msg.on403(reqRoleGE,roleAtAircraft, req))
      }
    } catch (e) {
      res.status(500).send(msg.on500(req,e))
    }
  },

  put1: async ({
    req,
    res,
    reqRoleGE,
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
          res.status(200).send(msg.on200(req))
        } else {
          res.status(403).send(msg.on403(reqRoleGE,roleAtAircraft,req))
        }
      } catch (e) {
        res.status(400).send(msg.on400(req))
      }
    } catch (e) {
      res.status(500).send(msg.on500(req,e))
    }
  },

  delete1: async ({
    req,
    res,
    reqRoleGE,
    delete1,
    readOBJatPK,
    objPK,
  }:delete1): Promise<void> => {
    try {
      const pk = req.body[objPK]
      const obj: any = await readOBJatPK(pk)
      const reqRoleAtOBJ = await query.readRoleAtAircraftID(req, obj.aircraftid)
  
      if (reqRoleAtOBJ >= reqRoleGE) {
        await delete1(pk)
        res.status(200).send(msg.on200(req))
      } else {
        res.status(403).send(msg.on403(reqRoleGE,reqRoleAtOBJ,req))
      }
    } catch (e) {
      res.status(500).send(msg.on500(req,e))
    }
  }
}
