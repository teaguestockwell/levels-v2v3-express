import {Request, Response, NextFunction} from 'express'
import query, {prisma} from '../prisma/query'

const logger = (req: Request, res: Response, next: NextFunction): void => {
  res.on('finish', () => {
    prisma.log
      .create({
        data: {
          resTime: parseInt(res.get('X-Response-Time')),
          status: res.statusCode,
          ep: req.baseUrl,
          email: query.readName(req),
          method: req.method,
          body:
            req.body && req.method === 'PUT' && res.statusCode === 200
              ? req.body
              : undefined,
          query:
            req.originalUrl.split('?').length === 0
              ? undefined
              : req.originalUrl.split('?')[1],
        },
      })
      .catch((e) => console.log(e))
  })
  next()
}

export default logger
