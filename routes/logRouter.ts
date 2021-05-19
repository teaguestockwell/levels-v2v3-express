import {Router} from 'express'
import query, {prisma} from '../prisma/query'
import { resMsg } from './baseRouter'
import * as yup from 'yup'


const logRouter = Router()

const logQuerySchema = yup.object().shape({
  logId: yup.number().integer().moreThan(0),
  toDateTime: yup.date(),
  fromDateTime: yup.date(),
  status: yup.number(),
  ep: yup.string(),
  email: yup.string(),
  method: yup.string(),
  pageIdx: yup.number().integer().moreThan(-1).required()
})

logRouter.get('*', async (req, res) => {
  try{
     const highestRole = await query.readHighestRole(req)
    if (highestRole >= 3) {
      try{
        console.log(req.query)
        const query = logQuerySchema.validateSync(req.query)
        const where: {[key: string]:any} = {}

        where.dateTime = query.fromDateTime && query.toDateTime ? {gte: query.fromDateTime, lte: query.toDateTime} : undefined
        where.status = query.status ? query.status : undefined
        where.ep = query.ep ? query.ep : undefined
        where.email = query.email ? query.email : undefined
        where.method = query.method ? query.method : undefined

        res.status(200).json(
          await prisma.log.findMany({
            orderBy: [
              {dateTime: 'asc'}
            ],
            where,
            skip: 1000 * query.pageIdx,
            take: 1000
          })
        )
        
      } catch(e){
        res.status(400).send(resMsg.on400(req,`${e}`))
      }
    } else {
      res.status(403).send(resMsg.on403(3, highestRole, req))
    }
  } catch (e) {
    res.status(500).send(resMsg.on500(req, e))
  }
})

export default logRouter