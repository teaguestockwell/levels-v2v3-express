import {seedTest} from './seed_test'

async function main() {
  await seedTest.deleteAll()
  await seedTest.c17aer()
  await seedTest.c17a()
  await seedTest.demo()
  await seedTest.deleteAllUsers()
  await seedTest.createProdAdmins()
  await seedTest.logs()
  process.exit()
}
main().catch()
