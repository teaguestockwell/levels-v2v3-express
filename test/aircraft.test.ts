import {Done} from 'mocha'
import req from 'supertest'
import assert from 'assert'
import server from '../server'
import {role0e, role2e, role3e, role4e, role2OnAir1e} from './utils'
import {Aircraft} from '@prisma/client'
import {seedTest} from '../prisma/seed_test'
import {client as prisma} from '../prisma/client'

const createAir: Aircraft = {
  aircraftId: 0,
  name: 'new',
  fs0: 100,
  fs1: 2000,
  mom0: 5000,
  mom1: 10000,
  weight0: 100000,
  weight1: 200000,
  cargoWeight1: 20000,
  lemac: 700,
  mac: 90,
  momMultiplyer: 10000,
}

const createAirNonUniqueName: Aircraft = {
  aircraftId: 0,
  name: 'C-17A-ER',
  fs0: 100,
  fs1: 2000,
  mom0: 5000,
  mom1: 10000,
  weight0: 100000,
  weight1: 200000,
  cargoWeight1: 20000,
  lemac: 700,
  mac: 90,
  momMultiplyer: 10000,
}

const updateAirNonUniqueName: Aircraft = {
  aircraftId: 1,
  name: 'C-17A', // update from C-17A-ER to reflect a non unique name
  fs0: 100,
  fs1: 2000,
  mom0: 5000,
  mom1: 10000,
  weight0: 100000,
  weight1: 200000,
  cargoWeight1: 20000,
  lemac: 700,
  mac: 90,
  momMultiplyer: 10000,
}

const updateAir: Aircraft = {
  aircraftId: 1,
  name: 'C-17A-Er', // update 'r 'to be lowercase
  fs0: 80.5,
  fs1: 2168,
  mom0: 9999,
  mom1: 50000,
  weight0: 260000,
  weight1: 300000,
  cargoWeight1: 300000,
  lemac: 793.6,
  mac: 309.5,
  momMultiplyer: 10000,
}

// READ
describe('GET /aircraft', () => {
  before(async () => {
    await seedTest.deleteAll()
    await seedTest.C_17_A_ER()
    await seedTest.C_17_A()
  })

  it('Should return empty[] for users with roles < 1', (done: Done) => {
    req(server)
      .get('/aircraft')
      .set('authorization', role0e)
      .expect(200)
      .expect((res) => {
        assert(res.body.length == 0)
      })
      .end(done)
  })

  it('Should return [].length == 2 for users with roles > 2 on 2 aircraft', (done: Done) => {
    req(server)
      .get('/aircraft')
      .set('authorization', role2e)
      .expect(200)
      .expect((res) => {
        assert(res.body.length == 2)
      })
      .end(done)
  })

  it('Should return [].length == 1 for users with roles > 2 on 1 aircraft', (done: Done) => {
    req(server)
      .get('/aircraft')
      .set('authorization', role2OnAir1e)
      .expect(200)
      .expect((res) => {
        assert(res.body.length == 1)
      })
      .end(done)
  })
})

describe('GET /aircraft/lastUpdated', () => {
  before(async () => {
    await seedTest.deleteAll()
    await seedTest.C_17_A_ER()
    await seedTest.C_17_A()
  })

  it('Should return empty[] for users with roles < 1', (done: Done) => {
    req(server)
      .get('/aircraft/lastUpdated')
      .set('authorization', role0e)
      .expect(200)
      .expect((res) => {
        assert(res.body.data.length == 0)
      })
      .end(done)
  })

  it('Should return [].length == 2 for users with roles > 2 on 2 aircraft', (done: Done) => {
    req(server)
      .get('/aircraft/lastUpdated')
      .set('authorization', role2e)
      .expect(200)
      .expect((res) => {
        assert(res.body.data.length == 2)
      })
      .end(done)
  })

  it('Should return [].length == 1 for users with roles > 2 on 1 aircraft', (done: Done) => {
    req(server)
      .get('/aircraft/lastUpdated')
      .set('authorization', role2OnAir1e)
      .expect(200)
      .expect((res) => {
        assert(res.body.data.length == 1)
      })
      .end(done)
  })
})

// UPDATE || CREATE
describe('PUT /aircraft', () => {
  // before each prevents bade state when modifies unique constrains
  // between tests
  beforeEach(async () => {
    await seedTest.deleteAll()
    await seedTest.C_17_A_ER()
    await seedTest.C_17_A()
  })

  it('Should 403 if the req role <= 2', (done: Done) => {
    req(server)
      .put('/aircraft')
      .set('authorization', role2e)
      .send(updateAir)
      .expect(403)
      .end(done)
  })

  it('Should 200 and update when the acft is valid, and req.role >= 3', (done: Done) => {
    req(server)
      .put('/aircraft')
      .set('authorization', role3e)
      .send(updateAir)
      .expect(200)
      .expect(async () => {
        const didFind = await prisma.aircraft.findUnique({
          where: {aircraftId: updateAir.aircraftId},
        })
        assert.deepStrictEqual(didFind, updateAir)
      })
      .end(done)
  })

  it('Should 200 and create when the acft is valid, and req.highestRole >= 3', (done: Done) => {
    req(server)
      .put('/aircraft')
      .set('authorization', role3e)
      .send(createAir)
      .expect(200)
      .expect(async () => {
        const didFind = await prisma.aircraft.findUnique({
          where: {name: createAir.name},
          include: {users: true},
        })

        // if req user creates air, they will have role 4 on it
        assert.deepStrictEqual(didFind.users[0].role, 4)
        assert.deepStrictEqual(didFind.name, createAir.name)
      })
      .end(done)
  })

  it('Should 400 if the name is not unique UPDATE', (done: Done) => {
    req(server)
      .put('/aircraft')
      .set('authorization', role3e)
      .send(updateAirNonUniqueName)
      .expect(400)
      .end(done)
  })

  it('Should 400 if the name is not unique CREATE', (done: Done) => {
    req(server)
      .put('/aircraft')
      .set('authorization', role3e)
      .send(createAirNonUniqueName)
      .expect(400)
      .end(done)
  })
})

// DELETE
describe('DELETE /aircraft', () => {
  before(async () => {
    await seedTest.deleteAll()
    await seedTest.C_17_A_ER()
  })

  it('Should 403 requests whose role @ aircraft <= 2', (done: Done) => {
    req(server)
      .delete('/aircraft?aircraftId=1')
      .set('authorization', role2e)
      .expect(403)
      .end(done)
  })

  it('Should delete all recursively where requests role @ aircraft > 2', (done: Done) => {
    req(server)
      .delete('/aircraft?aircraftId=1')
      .set('authorization', role4e)
      .expect(200)
      .expect(async () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const didFind: any[] = []

        // expect everything to cascade delete
        didFind.push(await prisma.aircraft.findMany({where: {aircraftId: 1}}))
        didFind.push(await prisma.user.findMany({where: {aircraftId: 1}}))
        didFind.push(await prisma.glossary.findMany({where: {aircraftId: 1}}))
        didFind.push(await prisma.glossary.findMany({where: {aircraftId: 1}}))
        didFind.push(await prisma.tank.findMany({where: {aircraftId: 1}}))
        didFind.push(await prisma.glossary.findMany({where: {aircraftId: 1}}))
        didFind.push(await prisma.config.findMany({where: {aircraftId: 1}}))
        didFind.push(
          await prisma.configCargo.findMany({where: {aircraftId: 1}})
        )
        didFind.push(await prisma.glossary.findMany({where: {aircraftId: 1}}))
        didFind.push(await prisma.cargo.findMany({where: {aircraftId: 1}}))

        assert.deepStrictEqual(didFind.length, 0)
      })
      .end(done)
  })
})
