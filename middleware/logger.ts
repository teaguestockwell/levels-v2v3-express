import {Request, Response, NextFunction} from 'express'
import {query} from '../prisma/query'
import {client as prisma} from '../prisma/client'

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
      .catch(() => {return})
  })
  next()
}

export default logger
