import {seedTest} from '../prisma/seed_test'
import {role0e, role1e, role2e, role3e} from './utils'
import {Done} from 'mocha'
import req from 'supertest'
import assert from 'assert'
import app from '../server'
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
    req(app)
      .get('/tank')
      .set('authorization', role1e)
      .send({aircraftid: 1}) // query all tank on air
      .expect(200)
      .expect((res) => {
        assert(res.body.length != 0)
      })
      .end(done)
  })

  it('Should 403 where req.role <1 on aircraft', (done: Done) => {
    req(app)
      .get('/tank')
      .set('authorization', role0e)
      .send({aircraftid: 1}) // query all tank on air
      .expect(403)
      .end(done)
  })
})

// UPDATE || CREATE
describe('PUT /tank', () => {
  const updateTank: Tank = {
    aircraftid: 1,
    tankid: 1,
    name: 'update tank name',
    simplemoms: 'update info here',
    weights: '123 I love pe',
  }

  const updateTankNonUnique: Tank = {
    aircraftid: 1,
    tankid: 1, // this is tank 1
    name: 'Tank 3 ER', // tank 1 cant be the same as tanks 3
    simplemoms: 'update info here',
    weights: '123 I love pe',
  }

  const newTank: Tank = {
    aircraftid: 1,
    tankid: 0, // 0 means this is a new tank - no id has been assined by db
    name: 'new tank name',
    simplemoms: 'info here',
    weights: '123 I love pe',
  }

  before(async () => {
    await seedTest.deleteAll()
    await seedTest.C_17_A_ER()
  })

  it('Should return 200 and update where tank is unquique && req.role >= 3', (done: Done) => {
    req(app)
      .put('/tank')
      .set('authorization', role3e)
      .send(updateTank)
      .expect(200)
      .end(done)
  })

  it('Should return 200 and create where tank is unquique && req.role >= 3', (done: Done) => {
    req(app)
      .put('/tank')
      .set('authorization', role3e)
      .send(newTank)
      .expect(200)
      .expect(async () => {
        const aircraftid_name = {
          aircraftid: newTank.aircraftid,
          name: newTank.name,
        }
        const found = await prisma.tank.findUnique({
          where: {aircraftid_name},
        })
        assert.deepStrictEqual(found.name, newTank.name)
        assert.deepStrictEqual(found.simplemoms, newTank.simplemoms)
        assert.deepStrictEqual(found.aircraftid, newTank.aircraftid)
      })
      .end(done)
  })

  it('Should return 403 where req.role <= 2 on aircraft', (done: Done) => {
    req(app)
      .put('/tank')
      .set('authorization', role2e)
      .send(updateTank)
      .expect(403)
      .end(done)
  })

  it('Should return 400 where tank name and aircraft id is not unique UPDATE', (done: Done) => {
    req(app)
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
    req(app)
      .delete('/tank')
      .set('authorization', role2e)
      .send({tankid: 1})
      .expect(403)
      .end(done)
  })

  it('Should 200 and delete where req.role <= 2 on aircraft', (done: Done) => {
    req(app)
      .delete('/tank')
      .set('authorization', role3e)
      .send({tankid: 1})
      .expect(200)
      .expect(async () => {
        let didFind: boolean
        await prisma.tank
          .findUnique({where: {tankid: 1}})
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
