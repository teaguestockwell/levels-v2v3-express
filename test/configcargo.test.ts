import {seedTest} from '../prisma/seed_test'
import {role0e, role1e, role2e, role3e} from './utils'
import {Done} from 'mocha'
import req from 'supertest'
import assert from 'assert'
import server from '../server'
import {ConfigCargo, PrismaClient} from '@prisma/client'


const prisma = new PrismaClient()

// READ
describe('GET /configcargo', () => {
  before(async () => {
    await seedTest.deleteAll()
    await seedTest.C_17_A_ER()
  })

  it('Should return configcargos[] of an aircraft given req.role on that aircraft >= 1', (done: Done) => {
    req(server)
      .get('/configcargo?aircraftid=1&configid=1')
      .set('authorization', role1e)
      .expect(200)
      .expect((res) => {
        assert(res.body.length != 0)
      })
      .end(done)
  })

  it('Should 403 where req.role <3 on aircraft', (done: Done) => {
    req(server)
      .get('/configcargo?aircraftid=1&configid=1')
      .set('authorization', role0e)
      .expect(403)
      .end(done)
  })
})

// UPDATE || CREATE
describe('PUT /configcargo', () => {
  //
  const updateConfigCargo: ConfigCargo = {
    aircraftid: 1,
    cargoid: 10,
    configcargoid: 24,
    configid: 2,
    fs: 200,
    qty: 20,
  }

  const updateConfigCargoNonUnique: ConfigCargo = {
    aircraftid: 1,
    // cannot have the same cargo id as config cargo #1,
    // because this would make two rows of the same type of cargo,
    // to add more of a cargo in a config, the user will change the qty,
    // they will not add more redundant rows!
    cargoid: 1,
    configcargoid: 2,
    configid: 1,
    fs: 200,
    qty: 20,
  }

  // add pass demo kits to AE-1 on C-17A-ER
  const newConfigCargo: ConfigCargo = {
    aircraftid: 1,
    cargoid: 10,
    configcargoid: 0,
    configid: 1,
    fs: 200,
    qty: 1337,
  }

  before(async () => {
    await seedTest.deleteAll()
    await seedTest.C_17_A_ER()
  })

  it('Should return 200 and update where configcargo is unquique && req.role >= 3', (done: Done) => {
    req(server)
      .put('/configcargo')
      .set('authorization', role3e)
      .send(updateConfigCargo)
      .expect(200)
      .end(done)
  })

  it('Should return 200 and create where configcargo is unquique && req.role >= 3', (done: Done) => {
    req(server)
      .put('/configcargo')
      .set('authorization', role3e)
      .send(newConfigCargo)
      .expect(200)
      .expect(async () => {
        const configid_aircraftid_cargoid = {
          aircraftid: newConfigCargo.aircraftid,
          configid: newConfigCargo.configid,
          cargoid: newConfigCargo.cargoid,
        }
        const found = await prisma.configCargo.findUnique({
          where: {configid_aircraftid_cargoid},
        })
        assert.deepStrictEqual(found.qty, newConfigCargo.qty)
        assert.deepStrictEqual(found.aircraftid, newConfigCargo.aircraftid)
      })
      .end(done)
  })

  it('Should return 403 where req.role < 3 on aircraft', (done: Done) => {
    req(server)
      .put('/configcargo')
      .set('authorization', role2e)
      .send(updateConfigCargo)
      .expect(403)
      .end(done)
  })

  it('Should return 400 where configcargo name and aircraft id is not unique UPDATE', (done: Done) => {
    req(server)
      .put('/configcargo')
      .set('authorization', role3e)
      .send(updateConfigCargoNonUnique)
      .expect(400)
      .end(done)
  })
})

// DELETE
describe('DELETE /configcargo', () => {
  before(async () => {
    await seedTest.deleteAll()
    await seedTest.C_17_A_ER()
  })

  it('Should 403 where req.role <= 2 on aircraft', (done: Done) => {
    req(server)
      .delete('/configcargo?configcargoid=1')
      .set('authorization', role2e)
      .expect(403)
      .end(done)
  })

  it('Should 200 and delete where req.role >= 3 on aircraft', (done: Done) => {
    req(server)
      .delete('/configcargo?configcargoid=1')
      .set('authorization', role3e)
      .expect(200)
      .expect(async () => {
        let didFind: boolean
        await prisma.configCargo
          .findUnique({where: {configcargoid: 1}})
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
