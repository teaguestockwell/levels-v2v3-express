import {seedTest} from './seed_test'

async function main() {
  await seedTest.deleteAll()
  await seedTest.C_17_A_ER()
  await seedTest.C_17_A()
  await seedTest.deleteAllUsers()
  await seedTest.createProdAdmins()
  await seedTest.generals()
  await seedTest.logs()
  process.exit()
}
main().catch()
