import {seedTest} from '../prisma/seed_test'
import {role0e, role1e, role2e, role3e} from './utils'
import {Done} from 'mocha'
import req from 'supertest'
import assert from 'assert'
import server from '../server'
import {Tank, PrismaClient} from '@prisma/client'
//import query from '../prisma/query'

const prisma = new PrismaClient()

// READ
describe('GET /tank', () => {
  before(async () => {
    await seedTest.deleteAll()
    await seedTest.C_17_A_ER()
  })

  it('Should return tanks[] of an aircraft given req.role on that aircraft >= 1', (done: Done) => {
    req(server)
      .get('/tank?aircraftId=1')
      .set('authorization', role1e)
      .expect(200)
      .expect((res) => {
        assert(res.body.length != 0)
      })
      .end(done)
  })

  it('Should 403 where req.role <1 on aircraft', (done: Done) => {
    req(server)
      .get('/tank?aircraftId=1')
      .set('authorization', role0e)
      .expect(403)
      .end(done)
  })
})

// UPDATE || CREATE
describe('PUT /tank', () => {
  const updateTank: Tank = {
    aircraftId: 1,
    tankId: 1,
    name: 'update tank name',
    simpleMomsCSV: 'update info here',
    weightsCSV: '123 I love pe',
  }

  const updateTankNonUnique: Tank = {
    aircraftId: 1,
    tankId: 1, // this is tank 1
    name: 'Tank 3 ER', // tank 1 cant be the same as tanks 3
    simpleMomsCSV: 'update info here',
    weightsCSV: '123 I love pe',
  }

  const newTank: Tank = {
    aircraftId: 1,
    tankId: 0, // 0 means this is a new tank - no aircraftId has been assined by db
    name: 'new tank name',
    simpleMomsCSV: 'info here',
    weightsCSV: '123 I love pe',
  }

  before(async () => {
    await seedTest.deleteAll()
    await seedTest.C_17_A_ER()
  })

  it('Should return 200 and update where tank is unquique && req.role >= 3', (done: Done) => {
    req(server)
      .put('/tank')
      .set('authorization', role3e)
      .send(updateTank)
      .expect(200)
      .end(done)
  })

  it('Should return 200 and create where tank is unquique && req.role >= 3', (done: Done) => {
    req(server)
      .put('/tank')
      .set('authorization', role3e)
      .send(newTank)
      .expect(200)
      .expect(async () => {
        const aircraftid_name = {
          aircraftId: newTank.aircraftId,
          name: newTank.name,
        }
        const found = await prisma.tank.findUnique({
          where: {aircraftid_name},
        })
        assert.deepStrictEqual(found.name, newTank.name)
        assert.deepStrictEqual(found.simpleMomsCSV, newTank.simpleMomsCSV)
        assert.deepStrictEqual(found.aircraftId, newTank.aircraftId)
      })
      .end(done)
  })

  it('Should return 403 where req.role <= 2 on aircraft', (done: Done) => {
    req(server)
      .put('/tank')
      .set('authorization', role2e)
      .send(updateTank)
      .expect(403)
      .end(done)
  })

  it('Should return 400 where tank name and aircraft aircraftId is not unique UPDATE', (done: Done) => {
    req(server)
      .put('/tank')
      .set('authorization', role3e)
      .send(updateTankNonUnique)
      .expect(400)
      .end(done)
  })
})

// DELETE
describe('DELETE /tank', () => {
  before(async () => {
    await seedTest.deleteAll()
    await seedTest.C_17_A_ER()
  })

  it('Should 403 where req.role <= 2 on aircraft', (done: Done) => {
    req(server)
      .delete('/tank?tankId=1')
      .set('authorization', role2e)
      .expect(403)
      .end(done)
  })

  it('Should 200 and delete where req.role <= 2 on aircraft', (done: Done) => {
    req(server)
      .delete('/tank?tankId=1')
      .set('authorization', role3e)
      .expect(200)
      .expect(async () => {
        let didFind: boolean
        await prisma.tank
          .findUnique({where: {tankId: 1}})
          .then(() => {
            didFind = true
          })
          .catch(() => {
            didFind = false
          })
        assert.deepStrictEqual(didFind, false)
      })
      .end(done)
  })
})
