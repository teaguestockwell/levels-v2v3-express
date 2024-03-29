import {seedTest} from '../prisma/seed_test'
import {role0e, role1e, role2e, role3e} from './utils'
import {Done} from 'mocha'
import req from 'supertest'
import assert from 'assert'
import server from '../server'
import {ConfigCargo} from '@prisma/client'
import {client as prisma} from '../prisma/client'

// READ
describe('GET /configcargo', () => {
  before(async () => {
    await seedTest.deleteAll()
    await seedTest.c17aer()
  })

  it('Should return configCargos[] of an aircraft given req.role on that aircraft >= 1', (done: Done) => {
    req(server)
      .get('/configcargo?aircraftId=1&configId=1')
      .set('authorization', role1e)
      .expect(200)
      .expect((res) => {
        assert(res.body.length != 0)
      })
      .end(done)
  })

  it('Should 403 where req.role <3 on aircraft', (done: Done) => {
    req(server)
      .get('/configcargo?aircraftId=1&configId=1')
      .set('authorization', role0e)
      .expect(403)
      .end(done)
  })
})

// UPDATE || CREATE
describe('PUT /configcargo', () => {
  //
  const updateConfigCargo: ConfigCargo = {
    updatedBy: 'developer',
    updated: new Date(),
    aircraftId: 1,
    cargoId: 10,
    configCargoId: 24,
    configId: 2,
    fs: 200,
    qty: 20,
  }

  const updateConfigCargoNonUnique: ConfigCargo = {
    updatedBy: 'developer',
    updated: new Date(),
    aircraftId: 1,
    // cannot have the same cargo aircraftId as config cargo #1,
    // because this would make two rows of the same type of cargo,
    // to add more of a cargo in a config, the user will change the qty,
    // they will not add more redundant rows!
    cargoId: 1,
    configCargoId: 2,
    configId: 1,
    fs: 200,
    qty: 20,
  }

  // add pass demo kits to AE-1 on C-17A-ER
  const newConfigCargo: ConfigCargo = {
    updatedBy: 'developer',
    updated: new Date(),
    aircraftId: 1,
    cargoId: 10,
    configCargoId: 0,
    configId: 1,
    fs: 200,
    qty: 1337,
  }

  before(async () => {
    await seedTest.deleteAll()
    await seedTest.c17aer()
  })

  it('Should return 200 and update where configcargo is unique && req.role >= 3', (done: Done) => {
    req(server)
      .put('/configcargo')
      .set('authorization', role3e)
      .send(updateConfigCargo)
      .expect(200)
      .end(done)
  })

  it('Should return 200 and create where configcargo is unique && req.role >= 3', (done: Done) => {
    req(server)
      .put('/configcargo')
      .set('authorization', role3e)
      .send(newConfigCargo)
      .expect(200)
      .expect(async () => {
        const configId_aircraftId_cargoId = {
          aircraftId: newConfigCargo.aircraftId,
          configId: newConfigCargo.configId,
          cargoId: newConfigCargo.cargoId,
        }
        const found = await prisma.configCargo.findUnique({
          where: {configId_aircraftId_cargoId},
        })
        assert.deepStrictEqual(found.qty, newConfigCargo.qty)
        assert.deepStrictEqual(found.aircraftId, newConfigCargo.aircraftId)
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

  it('Should return 400 where configcargo name and aircraft aircraftId is not unique UPDATE', (done: Done) => {
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
    await seedTest.c17aer()
  })

  it('Should 403 where req.role <= 2 on aircraft', (done: Done) => {
    req(server)
      .delete('/configcargo?configCargoId=1')
      .set('authorization', role2e)
      .expect(403)
      .end(done)
  })

  it('Should 200 and delete where req.role >= 3 on aircraft', (done: Done) => {
    req(server)
      .delete('/configcargo?configCargoId=1')
      .set('authorization', role3e)
      .expect(200)
      .expect(async () => {
        let didFind: boolean
        await prisma.configCargo
          .findUnique({where: {configCargoId: 1}})
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
