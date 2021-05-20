import errorHandler from 'express-mung'
import { Response, Request } from 'express'

const getMsg = (req:Request, status: number): {msg: string} => {
  try{
  if(status === 200){return {msg: `200: ${req.method} @ ${req.originalUrl}`}}
  if(status === 400){return {msg: `400: Name must be unique to ${req.method} @ ${req.originalUrl}`}}
  if(status === 403){return {msg: `403: You do not have a high enough role to ${req.method} @ ${req.originalUrl}`}}
  return {
    msg: `500: We cant ${req.method} @ ${req.originalUrl}. Please refresh the previous screen`,
  }} catch (e){console.error(e)}
}

export default errorHandler.json((body, req: Request, res: Response) => {
  console.log(body)
  try{
    if(Object.keys(body).length === 0){body = getMsg(req,res.statusCode)}
  } catch (e){console.log(e)}
})