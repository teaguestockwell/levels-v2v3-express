/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClient } from '@prisma/client'
import { mainModule } from 'process'
const prisma = new PrismaClient()

async function main() {
  await prisma.$executeRaw('DROP DATABASE')
}

main().catch((e) => {
  throw e
})
.finally(async () => await prisma.$disconnect())