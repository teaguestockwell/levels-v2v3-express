const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()


async function main(){
  const newAircraft = await prisma.aircraft.create({
    data:{
      name: 'plane1',
      fs0: 100,
      fs1: 200,
      tanks: {
        create: {name: 'tank1'},
      }
    }
  })
  const q = await prisma.aircraft.findMany()
  console.log("new air")
  console.log(newAircraft)
  console.log("query air")
  console.log(q)
  q.forEach((a) => console.log(a))
}

main()
  .catch(e => {throw e})
  .finally(async () =>  await prisma.$disconnect())