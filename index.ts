import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

// Whenever you make changes to your 
//Prisma schema in the future, you manually 
//need to invoke prisma generate in order to 
//accomodate the changes in your Prisma Client API.

class Services{
  constructor(){}

  public async disconnect(){
    await prisma.$disconnect
  }

  public async connect(){
    await prisma.$connect().catch((e) => {throw e})
  }

  public async seedAircraft(){
    await prisma.aircraft.create({
      data:{
        name: 'plane1',
        fs0: 100,
        fs1: 200,
        tanks: {
          create: {name: 'tank1'},
        }
      }
    }).catch(e => {throw e})
  }

  /// read all aircraft in db
  public async readAllAircraft(){
    return prisma.aircraft.findMany().toString()
  }

}