const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()



module.exports = {

  //create
  
  //read
  readAllAircraft: async () => await prisma.aircraft.findMany({
    include: {
      cargos: true,
      tanks: true,
      glossarys: true
    }
  })
  //readAllGeneral: () =>

  //update

  //delete
}