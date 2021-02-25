import {seedTest} from '../prisma/seed_test'
import {role0e, role1e, role2e, role3e, role3OnAir1e} from './utils'
import {Done} from 'mocha'
import req from 'supertest'
import assert from 'assert'
import server from '../server'
import {Cargo, PrismaClient} from '@prisma/client'
//import query from '../prisma/query'

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
      .set('authorization', role1e)
      .expect(200)
      .expect((res) => {
        assert(res.body.length != 0)
      })
      .end(done)
  })

  it('Should 403 where req.role <1 on aircraft', (done: Done) => {
    req(server)
      .get('/cargo?aircraftid=1')
      .set('authorization', role0e)
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
  }

  const updateCargoNonUnique: Cargo = {
    category: null,
    aircraftid: 1,
    cargoid: 1,
    name: 'Pax info card',
    fs: 221,
    weight: 200,
  }

  const newCargo: Cargo = {
    category: null,
    aircraftid: 1,
    cargoid: 0,
    name: 'new cargo',
    fs: 221,
    weight: 200,
  }

  const updateCargoWithWrongAircraftId: Cargo = {
    category: null,
    aircraftid: 1,
    cargoid: 50, // cargo id one does not belong to aircraft id 2
    name: 'Pax info card',
    fs: 221,
    weight: 200,
  }

  before(async () => {
    await seedTest.deleteAll()
    await seedTest.C_17_A_ER()
    await seedTest.C_17_A()
  })

  it('Should return 200 and update where cargo is unquique && req.role >= 3', (done: Done) => {
    req(server)
      .put('/cargo')
      .set('authorization', role3e)
      .send(updateCargo)
      .expect(200)
      .end(done)
  })

  it('Should return 200 and create where cargo is unquique && req.role >= 3', (done: Done) => {
    req(server)
      .put('/cargo')
      .set('authorization', role3e)
      .send(newCargo)
      .expect(200)
      .expect(async () => {
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
      })
      .end(done)
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
  // so they are trying trick our api by sending an aircraft id where they have roles,
  // not today hacker!
  it('Should return 403 where req.role <= 2 @ obj with inalid aircraft id', (done: Done) => {
    req(server)
      .put('/cargo')
      .set('authorization', role3OnAir1e) 
      .send(updateCargoWithWrongAircraftId)
      .expect(403)
      .end(done)
  })

  it('Should return 400 where cargo name and aircraft id is not unique UPDATE', (done: Done) => {
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
      .delete('/cargo?cargoid=1')
      .set('authorization', role2e)
      .expect(403)
      .end(done)
  })

  it('Should 200 and delete where req.role <= 2 on aircraft', (done: Done) => {
    req(server)
      .delete('/cargo?cargoid=1')
      .set('authorization', role3e)
      .expect(200)
      .expect(async () => {
        let didFind: boolean
        await prisma.cargo
          .findUnique({where: {cargoid: 1}})
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
