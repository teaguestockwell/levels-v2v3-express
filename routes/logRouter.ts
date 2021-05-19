import {Router} from 'express'
import query, {prisma} from '../prisma/query'
import * as yup from 'yup'
import { sendWrapped, sendWrapped500 } from './baseRouter'


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
     const user = await query.readUserWithHighestRole(req)
    if (user.role >= 3) {
      try{
        console.log(req.query)
        const query = logQuerySchema.validateSync(req.query)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const where: {[key: string]:any} = {}

        where.dateTime = query.fromDateTime && query.toDateTime ? {gte: query.fromDateTime, lte: query.toDateTime} : undefined
        where.status = query.status ? query.status : undefined
        where.ep = query.ep ? query.ep : undefined
        where.email = query.email ? query.email : undefined
        where.method = query.method ? query.method : undefined

        sendWrapped({
          user,
          req,
          res,
          roleGE: 3,
          status: 200,
          resBody: await prisma.log.findMany({
            orderBy: [
              {dateTime: 'asc'}
            ],
            where,
            skip: 1000 * query.pageIdx,
            take: 1000
          })
        }) 
      } catch(e){
        sendWrapped({
          req,
          res,
          status: 400,
          roleGE: 3
        })
      }
    } else {
      sendWrapped({
        user,
        req,
        res,
        status: 403,
        roleGE: 3
      })
    }
  } catch (e) {
    sendWrapped500({
      req,
      res,
      e
    })
  }
})

export default logRouter