/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import query from '../prisma/query'
import {Request, Response} from 'express'

interface getN {
  req: Request
  res: Response
  roleGE: number
  bodyIDPara?: string
  pk?: string
  readNAtPK: (id: number) => Promise<any[]>
  readAircraftIDOfOBJpk?: (obj: number) => Promise<number>
}

interface put1 {
  req: Request
  res: Response
  roleGE: number
  pk?: string
  readAircraftIDOfOBJpk?: (obj: number) => Promise<number>
  upsertType: (obg: any) => Promise<void>
}

interface delete1 {
  objPK: string
  req: Request
  res: Response
  roleGE: number
  delete1: (pk: any) => Promise<void>
  readOBJatPK: (pk: number) => Promise<any>
}

// TODO: add 400 res for request that dont have aircraft aircraftId / pk
export const baseRouter = {
  getN: async ({
    req,
    res,
    roleGE,
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
        
        if (user.role >= roleGE) {
          res.status(200).send(await readNAtPK(pkNum))
        } else {
         res.status(403).send()
      }
    } catch (e) {
      res.status(400).send()
    }
    } catch (e) {
      res.status(500).send()
    }
  },

  put1: async ({
    req,
    res,
    roleGE,
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

        if (user.role >= roleGE) {
          await upsertType(obj)
          res.status(200).send()
        } else {
          res.status(403).send()
        }
      } catch (e) {
        res.status(400).send()
      }
    } catch (e) {
      res.status(500).send()
    }
  },

  delete1: async ({
    req,
    res,
    roleGE,
    delete1,
    readOBJatPK,
    objPK,
  }: delete1): Promise<void> => {
    try {
      try{

        const pk = Number(req.query[objPK])
        const obj: any = await readOBJatPK(pk)
        const user = await query.readUserAtReqAndAircraftId(req, obj.aircraftId)
        
        if (user.role >= roleGE) {
          await delete1(pk)
          res.status(200).send()
      } else {
        res.status(403).send()
      }
    } catch (e) {
      res.status(400).send()
    }
    } catch (e) {
      res.status(500).send()
    }
  },
}
