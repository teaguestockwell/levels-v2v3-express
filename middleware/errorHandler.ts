import errorHandler from 'express-mung'
import {Response, Request} from 'express'

// given each res, when they dont have a body, transform the res before sending
const handle = (body, _req: Request, res: Response) => {
  try {
    if (!body) {
      if (res.statusCode === 200) {
        return {msg: `200: Successful`}
      }
      if (res.statusCode === 400) {
        return {
          msg: `400: Invalid input, name must be unique`,
        }
      }
      if (res.statusCode === 403) {
        return {
          msg: `403: You're not allowed to do that`,
        }
      }
      return {
        msg: `500: Error please refresh`,
      }
    }
  } catch (e) {
    return
  }
}

// mungError: defines if the middleware will transform responses with an http error code
export default errorHandler.json(handle, {mungError: true})
