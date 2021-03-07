import {seedTest} from '../prisma/seed_test'
import {fakeWrapper, role0, role1, role2, role3, role3OnAir1, lastModifiedInfo} from './utils'
import {Done} from 'mocha'
import req from 'supertest'
import assert from 'assert'
import server from '../server'
import {Cargo, PrismaClient} from '@prisma/client'

const prisma = new PrismaClient()

// READ
describe('GET /cargo', () => {
  before(async () => {
    await seedTest.deleteAll()
    await seedTest.C_17_A_ER()
  })

  it('Should return cargos[] of an aircraft given req.role on that aircraft >= 1', (done: Done) => {
    req(server)
      .get('/cargo?aircraftid=1')
      .set('authorization', fakeWrapper(role1))
      .expect(200)
      .expect((res) => {
        assert(res.body.length != 0)
        assert.strictEqual(res.body[0].lastModifiedBy, "unknown")
        assert("lastModified" in res.body[0])
      })
      .end(done)
  })

  it('Should 403 where req.role <1 on aircraft', (done: Done) => {
    req(server)
      .get('/cargo?aircraftid=1')
      .set('authorization', fakeWrapper(role0))
      .expect(403)
      .end(done)
  })
})

// UPDATE || CREATE
describe('PUT /cargo', () => {
  const updateCargo: Cargo = {
    category: null,
    aircraftid: 1,
    cargoid: 1,
    name: 'update cargo name',
    fs: 221,
    weight: 200,
    ...lastModifiedInfo
  }

  const updateCargoNonUnique: Cargo = {
    category: null,
    aircraftid: 1,
    cargoid: 1,
    name: 'Pax info card',
    fs: 221,
    weight: 200,
    ...lastModifiedInfo
  }

  const newCargo: Cargo = {
    category: null,
    aircraftid: 1,
    cargoid: 0,
    name: 'new cargo',
    fs: 221,
    weight: 200,
    ...lastModifiedInfo
  }

  const updateCargoWithWrongAircraftId: Cargo = {
    category: null,
    aircraftid: 1,
    cargoid: 50, // cargo id one does not belong to aircraft id 2
    name: 'Pax info card',
    fs: 221,
    weight: 200,
    ...lastModifiedInfo
  }

  before(async () => {
    await seedTest.deleteAll()
    await seedTest.C_17_A_ER()
    await seedTest.C_17_A()
  })

  it('Should return 200 and update where cargo is unquique && req.role >= 3', (done: Done) => {
    req(server)
      .put('/cargo')
      .set('authorization', fakeWrapper(role3))
      .send(updateCargo)
      .expect(200)
      .end(done)
  })

  it('Should return 200 and create where cargo is unquique && req.role >= 3', async () => {
    await req(server)
      .put('/cargo')
      .set('authorization', fakeWrapper(role3))
      .send(newCargo)
      .expect(200);

    const name_aircraftid = {
      aircraftid: newCargo.aircraftid,
      name: newCargo.name,
    }
    const found = await prisma.cargo.findUnique({
      where: {name_aircraftid},
    })
    assert.deepStrictEqual(found.name, newCargo.name)
    assert.deepStrictEqual(found.weight, newCargo.weight)
    assert.deepStrictEqual(found.aircraftid, newCargo.aircraftid)
    assert.notStrictEqual(found.lastModified, newCargo.lastModified)
    assert.notStrictEqual(found.lastModifiedBy, newCargo.lastModifiedBy)
    assert.strictEqual(found.lastModifiedBy, role3.email)
  })

  it('Should return 403 where req.role <= 2 on aircraft', (done: Done) => {
    req(server)
      .put('/cargo')
      .set('authorization', fakeWrapper(role2))
      .send(updateCargo)
      .expect(403)
      .end(done)
  })

  // this user does not have roles on this aircraft,
  // so they are trying trick our api by sending an aircraft id where they have roles,
  // not today hacker!
  it('Should return 403 where req.role <= 2 @ obj with inalid aircraft id', (done: Done) => {
    req(server)
      .put('/cargo')
      .set('authorization', fakeWrapper(role3OnAir1))
      .send(updateCargoWithWrongAircraftId)
      .expect(403)
      .end(done)
  })

  it('Should return 400 where cargo name and aircraft id is not unique UPDATE', (done: Done) => {
    req(server)
      .put('/cargo')
      .set('authorization', fakeWrapper(role3))
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
      .delete('/cargo?cargoid=1')
      .set('authorization', fakeWrapper(role2))
      .expect(403)
      .end(done)
  })

  it('Should 200 and delete where req.role <= 2 on aircraft', async () => {
    await req(server)
      .delete('/cargo?cargoid=1')
      .set('authorization', fakeWrapper(role3))
      .expect(200)
      
    const found=await prisma.cargo.findUnique({where: {cargoid: 1}})
    assert.deepStrictEqual(found, null);
  })
})
