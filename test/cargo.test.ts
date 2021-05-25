import {seedTest} from '../prisma/seed_test'
import {
  encodeAuth,
  role0e,
  role1e,
  role2e,
  role3e,
  role3OnAir1e,
  lastModifiedInfo,
  role3,
} from './utils'
import {Done} from 'mocha'
import req from 'supertest'
import assert from 'assert'
import server from '../server'
import {Cargo } from '@prisma/client'
import {client as prisma} from '../prisma/client'

// READ
describe('GET /cargo', () => {
  before(async () => {
    await seedTest.deleteAll()
    await seedTest.C_17_A_ER()
  })

  it('Should return cargos[] of an aircraft given req.role on that aircraft >= 1', (done: Done) => {
    req(server)
      .get('/cargo?aircraftId=1')
      .set('authorization', role1e)
      .expect(200)
      .expect((res) => {
        assert(res.body.length != 0)
        assert.strictEqual(res.body[0].updatedBy, 'unknown')
        assert('updated' in res.body[0])
      })
      .end(done)
  })

  it('Should 403 where req.role <1 on aircraft', (done: Done) => {
    req(server)
      .get('/cargo?aircraftId=1')
      .set('authorization', role0e)
      .expect(403)
      .end(done)
  })
})

// UPDATE || CREATE
describe('PUT /cargo', () => {
  const updateCargo: Cargo = {
    category: null,
    aircraftId: 1,
    cargoId: 1,
    name: 'update cargo name',
    fs: 221,
    weight: 200,
    ...lastModifiedInfo,
  }

  const updateCargoNonUnique: Cargo = {
    category: null,
    aircraftId: 1,
    cargoId: 1,
    name: 'Pax info card',
    fs: 221,
    weight: 200,
    ...lastModifiedInfo,
  }

  const newCargo: Cargo = {
    category: null,
    aircraftId: 1,
    cargoId: 0,
    name: 'new cargo',
    fs: 221,
    weight: 200,
    ...lastModifiedInfo,
  }

  const updateCargoWithWrongAircraftId: Cargo = {
    category: null,
    aircraftId: 1,
    cargoId: 50, // cargo aircraftId one does not belong to aircraft aircraftId 2
    name: 'Pax info card',
    fs: 221,
    weight: 200,
    ...lastModifiedInfo,
  }

  before(async () => {
    await seedTest.deleteAll()
    await seedTest.C_17_A_ER()
    await seedTest.C_17_A()
  })

  it('Should return 200 and update where cargo is unique && req.role >= 3', (done: Done) => {
    req(server)
      .put('/cargo')
      .set('authorization', role3e)
      .send(updateCargo)
      .expect(200)
      .end(done)
  })

  it('Should return 200 and create where cargo is unique && req.role >= 3', async () => {
    await req(server)
      .put('/cargo')
      .set('authorization', encodeAuth(role3))
      .send(newCargo)
      .expect(200)

    const name_aircraftId = {
      aircraftId: newCargo.aircraftId,
      name: newCargo.name,
    }
    const found = await prisma.cargo.findUnique({
      where: {name_aircraftId},
    })
    assert.deepStrictEqual(found.name, newCargo.name)
    assert.deepStrictEqual(found.weight, newCargo.weight)
    assert.deepStrictEqual(found.aircraftId, newCargo.aircraftId)
    assert.notStrictEqual(found.updated, newCargo.updated)
    assert.notStrictEqual(found.updatedBy, newCargo.updatedBy)
    assert.strictEqual(found.updatedBy, role3.email)
  })

  it('Should return 403 where req.role <= 2 on aircraft', (done: Done) => {
    req(server)
      .put('/cargo')
      .set('authorization', role2e)
      .send(updateCargo)
      .expect(403)
      .end(done)
  })

  // this user does not have roles on this aircraft,
  // so they are trying trick our api by sending an aircraft aircraftId where they have roles,
  // not today hacker!
  it('Should return 400 where req.role <= 2 @ obj with invalid aircraft aircraftId', (done: Done) => {
    req(server)
      .put('/cargo')
      .set('authorization', role3OnAir1e)
      .send(updateCargoWithWrongAircraftId)
      .expect(400)
      .end(done)
  })

  it('Should return 400 where cargo name and aircraft aircraftId is not unique UPDATE', (done: Done) => {
    req(server)
      .put('/cargo')
      .set('authorization', role3e)
      .send(updateCargoNonUnique)
      .expect(400)
      .end(done)
  })
})

// DELETE
describe('DELETE /cargo', () => {
  before(async () => {
    await seedTest.deleteAll()
    await seedTest.C_17_A_ER()
  })

  it('Should 403 where req.role <= 2 on aircraft', (done: Done) => {
    req(server)
      .delete('/cargo?cargoId=1')
      .set('authorization', role2e)
      .expect(403)
      .end(done)
  })

  it('Should 200 and delete where req.role <= 2 on aircraft', async () => {
    await req(server)
      .delete('/cargo?cargoId=1')
      .set('authorization', role3e)
      .expect(200)

    const found = await prisma.cargo.findUnique({where: {cargoId: 1}})
    assert.deepStrictEqual(found, null)
  })
})
