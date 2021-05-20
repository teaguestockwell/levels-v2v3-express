import {Router} from 'express'
import query, {prisma} from '../prisma/query'
import * as yup from 'yup'


const logRouter = Router()

const logQuerySchema = yup.object().shape({
  logId: yup.number().integer().moreThan(0),
  dateLTE: yup.date(),
  dateGTE: yup.date(),
  status: yup.number().integer(),
  ep: yup.string(),
  email: yup.string(),
  method: yup.string(),
  pageIdx: yup.number().integer().moreThan(-1).required(),
  resTimeGTE: yup.number().integer().positive(),
  resTimeLTE: yup.number().integer().positive()
})

logRouter.get('*', async (req, res) => {
  try{
     const user = await query.readUserWithHighestRole(req)
    if (user.role >= 3) {
      try{
        const query = logQuerySchema.validateSync(req.query)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const where: {[key: string]:any} = {}

        where.resTime = query.resTimeGTE && query.dateLTE ? {gte: query.resTimeGTE, lte: query.dateLTE} : undefined
        where.dateTime = query.dateGTE && query.dateLTE ? {gte: query.dateGTE, lte: query.dateLTE} : undefined
        where.status = query.status ? query.status : undefined
        where.ep = query.ep ? query.ep : undefined
        where.email = query.email ? query.email : undefined
        where.method = query.method ? query.method : undefined

       res.status(200).send(
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
        res.status(400).send(e.toString())
      }
    } else {
      res.status(403).send()
    }
  } catch (e) {
    res.status(500).send()
  }
})

export default logRouter