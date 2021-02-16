export const baseRoute = {
  getN: async (
    req:Request,
    res:Response,
    roleGE:number,
    readNAtID:Function,
    bodyIDPara:string,
    logging:boolean
  ):Promise<void> => {
    try{
    const id:number = req.body.bodyIDPara
    } catch (e){if(logging){console.log(e)}}
  }
}