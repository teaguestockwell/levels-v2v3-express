/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import query, { prisma } from '../prisma/query'
import {Request, Response} from 'express'
import { User } from '@prisma/client'

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

export const getMsg = (req:Request, status: number, roleGE: number | undefined, role: number | undefined): {msg: string} => {
  try{
  if(status === 200){return {msg: `200: ${req.method} @ ${req.originalUrl}`}}
  if(status === 400){return {msg: `400: Name must be unique to ${req.method} @ ${req.originalUrl}`}}
  if(status === 403){return {msg: `403: Role greater or equal to ${roleGE} needed to ${req.method} @ ${req.originalUrl}. Your role is ${role}`}}
  return {
    msg: `500: We cant ${req.method} @ ${req.originalUrl}. Please refresh the previous screen`,
  }} catch (e){console.error(e)}
}

export const sendWrapped = (
  {
    msg,
    status,
    req,
    res,
    user = undefined,
    resBody,
    roleGE
  }:
  {
    msg?:string | undefined,
    status:number,
    req: Request,
    res:Response,
    resBody?: unknown | undefined,
    user?: User | undefined,
    roleGE: number | undefined
  }): void => { 
    try{
      res.status(status).send(
        status === 200 && resBody ? resBody : msg ? {msg} : getMsg(req,status,roleGE,user?.role)
      )
      user = user ? user : {name: query.readName(req), role: -1, aircraftId: -1, userId: -1},
      prisma.log.create({
        data:{
          status,
          ep: req.baseUrl,
          email: user?.name ?? 'no name',
          method: req.method,
          role: user?.role ?? 0,
          body: req.body && req.method === 'put' ? JSON.stringify(req.body) : undefined
        }
      })
    } catch (e) {
      console.error(e + '############################')
    }
}

export const sendWrapped500 = (
  {
    req,
    res,
    e,
  }:
  {
    req: Request,
    res:Response,
    e: string
  }): void => {
    res.status(500).send({
      msg: `500: We cant ${req.method} @ ${req.originalUrl}. Please refresh the previous screen`,
    })
    try{
      prisma.log.create({
        data:{
          status: 500,
          ep: req.baseUrl,
          email: 'api.user@dev.com',
          method: req.method,
          role: 0,
          body: e
        }
      })
    } catch (e) {
      console.error(e)
    }
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
      try{

        // to mitigate role exploitation, verify the aircraft aircraftId given the obj pk.
        // an example of where this is applicable is GET /configcargo
        // if the pk is aircraft aircraftId this is unnecessary
        const pkNum = Number(req.query[pk])
        const user = await query.readUserAtReqAndAircraftId(req, pk !== 'aircraftId' ? await readAircraftIDOfOBJpk(pkNum) : pkNum) 
        
        if (user.role >= reqRoleGE) {
          sendWrapped({
            user,
            req,
            res,
            status: 200,
            resBody: await readNAtPK(pkNum),
            roleGE: reqRoleGE
          })
        } else {
          sendWrapped({
            user,
          req,
          res,
          status: 403,
          roleGE: reqRoleGE
        })
      }
    } catch (e) {
      sendWrapped({
        req,
        res,
        status: 400,
        roleGE: reqRoleGE
      })
    }
    } catch (e) {
      sendWrapped500({
        req,
        res,
        e
      })
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
        // because this is a create or update ep and a pkNum of 0 is a create req,
        // we dont need to check the role @ an object that has not been created yet
        const obj = req.body
        const pkNum = Number(req.body[pk])
        const verifiedAirId = pk !== 'aircraftId' && pkNum !== 0 ? await readAircraftIDOfOBJpk(pkNum) : req.body.aircraftId
        const user = await query.readUserAtReqAndAircraftId(req, verifiedAirId)

        if (user.role >= reqRoleGE) {
          await upsertType(obj)
          sendWrapped({
            user,
            req,
            res,
            status: 200,
            roleGE: reqRoleGE
          })
        } else {
          sendWrapped({
            user,
            req,
            res,
            status: 403,
            roleGE: reqRoleGE
          })
        }
      } catch (e) {
        sendWrapped({
          req,
          res,
          status: 400,
          roleGE: reqRoleGE
        })
      }
    } catch (e) {
      sendWrapped500({
        req,
        res,
        e
      })
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
      try{

        const pk = Number(req.query[objPK])
        const obj: any = await readOBJatPK(pk)
        const user = await query.readUserAtReqAndAircraftId(req, obj.aircraftId)
        
        if (user.role >= reqRoleGE) {
          await delete1(pk)
        sendWrapped({
          user,
          req,
          res,
          status: 200,
          roleGE: reqRoleGE
        })
      } else {
        sendWrapped({
          user,
          req,
          res,
          status: 403,
          roleGE: reqRoleGE
        })
      }
    } catch (e) {
      sendWrapped({
        req,
        res,
        status: 400,
        roleGE: reqRoleGE
      })
    }
    } catch (e) {
      sendWrapped500({
        req,
        res,
        e
      })
    }
  },
}
