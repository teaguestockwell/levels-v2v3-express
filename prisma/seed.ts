import {seedTest} from './seed_test'

async function main() {
  console.log('deleting test data')
  await seedTest.deleteAll()
  console.log('seeding prod data')
  await seedTest.C_17_A_ER()
  await seedTest.C_17_A()
  await seedTest.generals()
  console.log('seeding complete')
}

console.log('seeds called')
main().catch((e) => {throw e})

