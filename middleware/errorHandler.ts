import errorHandler from 'express-mung'
import {Response, Request} from 'express'

// given each res, when they dont have a body, transform the res before sending
const handle = (body, req: Request, res: Response) => {
  try {
    if (!body) {
      if (res.statusCode === 200) {
        return {msg: `200: ${req.method} @ ${req.originalUrl}`}
      }
      if (res.statusCode === 400) {
        return {
          msg: `400: Name must be unique to ${req.method} @ ${req.originalUrl}`,
        }
      }
      if (res.statusCode === 403) {
        return {
          msg: `403: You do not have a high enough role to ${req.method} @ ${req.originalUrl}`,
        }
      }
      return {
        msg: `500: We cant ${req.method} @ ${req.originalUrl}. Please refresh the previous screen`,
      }
    }
  } catch (e) {
    return
  }
}

// mungError: defines if the middleware will transform responses with an http error code
export default errorHandler.json(handle, {mungError: true})
