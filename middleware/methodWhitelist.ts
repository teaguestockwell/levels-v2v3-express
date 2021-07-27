import {Request, Response, NextFunction} from 'express'

const whitelist = ['GET', 'PUT', 'DELETE']

const methodsWhitelist = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    if (whitelist.includes(req.method)) {
      next()
      return
    }
    res.status(405).send({msg: `${req.method} is not a supported method`})
    // eslint-disable-next-line no-empty
  } catch {}
  res.status(500).send()
}

export default methodsWhitelist
