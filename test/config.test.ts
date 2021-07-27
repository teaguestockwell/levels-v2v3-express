import {seedTest} from '../prisma/seed_test'
import {role0e, role1e, role2e, role3e} from './utils'
import {Done} from 'mocha'
import req from 'supertest'
import assert from 'assert'
import server from '../server'
import {Config} from '@prisma/client'
import {client as prisma} from '../prisma/client'

// READ
describe('GET /config', () => {
  before(async () => {
    await seedTest.deleteAll()
    await seedTest.C_17_A_ER()
  })

  it('Should return configs[] of an aircraft given req.role on that aircraft >= 1', (done: Done) => {
    req(server)
      .get('/config?aircraftId=1')
      .set('authorization', role1e)
      .expect(200)
      .expect((res) => {
        assert(res.body.length != 0)
      })
      .end(done)
  })

  it('Should 403 where req.role <3 on aircraft', (done: Done) => {
    req(server)
      .get('/config?aircraftId=1')
      .set('authorization', role0e)
      .expect(403)
      .end(done)
  })
})

// UPDATE || CREATE
describe('PUT /config', () => {
  const updateConfig: Config = {
    aircraftId: 1,
    configId: 1,
    name: 'update config name',
  }

  const updateConfigNonUnique: Config = {
    aircraftId: 1,
    configId: 1,
    name: 'AE-2', // non unique name
  }

  const newConfig: Config = {
    aircraftId: 1,
    configId: 0,
    name: 'new config',
  }

  before(async () => {
    await seedTest.deleteAll()
    await seedTest.C_17_A_ER()
  })

  it('Should return 200 and update where config is unique && req.role >= 3', (done: Done) => {
    req(server)
      .put('/config')
      .set('authorization', role3e)
      .send(updateConfig)
      .expect(200)
      .end(done)
  })

  it('Should return 200 and create where config is unique && req.role >= 3', (done: Done) => {
    req(server)
      .put('/config')
      .set('authorization', role3e)
      .send(newConfig)
      .expect(200)
      .expect(async () => {
        const name_aircraftId = {
          aircraftId: newConfig.aircraftId,
          name: newConfig.name,
        }
        const found = await prisma.config.findUnique({
          where: {name_aircraftId},
        })
        assert.deepStrictEqual(found.name, newConfig.name)
        assert.deepStrictEqual(found.aircraftId, newConfig.aircraftId)
      })
      .end(done)
  })

  it('Should return 403 where req.role < 3 on aircraft', (done: Done) => {
    req(server)
      .put('/config')
      .set('authorization', role2e)
      .send(updateConfig)
      .expect(403)
      .end(done)
  })

  it('Should return 400 where config name and aircraft aircraftId is not unique UPDATE', (done: Done) => {
    req(server)
      .put('/config')
      .set('authorization', role3e)
      .send(updateConfigNonUnique)
      .expect(400)
      .end(done)
  })
})

// DELETE
describe('DELETE /config', () => {
  before(async () => {
    await seedTest.deleteAll()
    await seedTest.C_17_A_ER()
  })

  it('Should 403 where req.role <= 2 on aircraft', (done: Done) => {
    req(server)
      .delete('/config?configId=1')
      .set('authorization', role2e)
      .expect(403)
      .end(done)
  })

  it('Should 200 and delete where req.role >= 3 on aircraft', (done: Done) => {
    req(server)
      .delete('/config?configId=1')
      .set('authorization', role3e)
      .expect(200)
      .expect(async () => {
        let didFind: boolean
        await prisma.config
          .findUnique({where: {configId: 1}})
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
