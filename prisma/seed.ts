import {seedTest} from './seed_test'

async function main() {
  await seedTest.deleteAll()
  await seedTest.C_17_A_ER()
  await seedTest.C_17_A()
  await seedTest.generals()
}

main().catch((e) => {
  throw e
})
