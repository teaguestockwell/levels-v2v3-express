import {seedTest} from './seed_test'
import {prisma} from './seed_test'

async function main() {
  await seedTest.deleteAll()
  await seedTest.C_17_A_ER()
  await seedTest.C_17_A()
  await seedTest.generals()
  await seedTest.logs()
  await prisma.$disconnect()
  process.exit()
}
main().catch()
