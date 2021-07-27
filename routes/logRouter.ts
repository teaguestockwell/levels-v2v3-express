import {Router} from 'express'
import {query} from '../prisma/query'
import {client as prisma} from '../prisma/client'
import * as yup from 'yup'

const logRouter = Router()

const logParamsSchema = yup.object().shape({
  logId: yup.number().integer().moreThan(0),
  dateLTE: yup.date(),
  dateGTE: yup.date(),
  status: yup.number().integer(),
  ep: yup.string(),
  email: yup.string(),
  method: yup.string(),
  pageIdx: yup.number().integer().moreThan(-1).required(),
  resTimeGTE: yup.number().integer().positive(),
  resTimeLTE: yup.number().integer().positive(),
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getQueryObj = (logParams: any): {[key: string]: any} => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: {[key: string]: any} = {}

  where.resTime =
    logParams.resTimeGTE && logParams.dateLTE
      ? {gte: logParams.resTimeGTE, lte: logParams.dateLTE}
      : undefined

  where.dateTime =
    logParams.dateGTE && logParams.dateLTE
      ? {gte: logParams.dateGTE, lte: logParams.dateLTE}
      : undefined

  where.status = logParams.status ? logParams.status : undefined

  where.ep = logParams.ep ? logParams.ep : undefined

  where.email = logParams.email ? logParams.email : undefined

  where.method = logParams.method ? logParams.method : undefined

  return where
}

logRouter.get('*', async (req, res) => {
  try {
    const user = await query.readUserWithHighestRole(req)
    if (user.role >= 3) {
      try {
        const logParams = logParamsSchema.validateSync(req.query)

        res.status(200).json(
          await prisma.log.findMany({
            orderBy: [{dateTime: 'asc'}],
            where: getQueryObj(logParams),
            skip: 1000 * logParams.pageIdx,
            take: 1000,
          })
        )
      } catch (e) {
        res.status(400).json(e.toString())
      }
    } else {
      res.status(403).json()
    }
  } catch (e) {
    res.status(500).json()
  }
})

export default logRouter
