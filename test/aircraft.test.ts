import {Done} from 'mocha'
import req from 'supertest'
import assert from 'assert'
import server from '../server'
import {role0e, role2e, role3e, role4e, role2OnAir1e, role1e} from './utils'
import {Aircraft} from '@prisma/client'
import {seedTest} from '../prisma/seed_test'
import {client as prisma} from '../prisma/client'

const createAir: Aircraft = {
  updatedBy: 'developer',
  updated: new Date(),
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
  deepHashId: '0',
}

const createAirNonUniqueName: Aircraft = {
  updatedBy: 'developer',
  updated: new Date(),
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
  deepHashId: '0',
}

const updateAirNonUniqueName: Aircraft = {
  updatedBy: 'developer',
  updated: new Date(),
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
  deepHashId: '0',
}

const updateAir: Aircraft = {
  updatedBy: 'developer',
  updated: new Date(),
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
  deepHashId: '0',
}

describe('GET /aircraft/client-server-sync', () => {
  before(async () => {
    await seedTest.deleteAll()
    await seedTest.c17aer()
    await seedTest.c17a()
  })

  it('should 400 requests without query params',()=>{
    req(server)
    .get('/aircraft/client-server-sync')
    .set('authorization', role1e)
    .expect(400)
  })

  it('should 200 requests with a query params',()=>{
    req(server)
    .get('/aircraft/client-server-sync?1=asdasd&2=asdasd')
    .set('authorization', role1e)
    .expect(200)
  })

  it('should return the correct data state inside the body for c17a and c17aer', async ()=>{
    const deepHashIdAir1 = '123'
    const deepHashIdAir2 = '321'

    const expectedDataState = {
      1: deepHashIdAir1,
      2: deepHashIdAir2,
    }

    // updated the hashed
    await prisma.aircraft.update({
      where: {aircraftId: 1},
      data: {
        deepHashId: deepHashIdAir1
      }
    })

    await prisma.aircraft.update({
      where: {aircraftId: 2},
      data: {
        deepHashId: deepHashIdAir2
      }
    })

    req(server)
    .get('/aircraft/client-server-sync?1=asdasd&2=asdasd')
    .set('authorization', role1e)
    .expect(200)
    .expect(res => {
      assert.deepStrictEqual(res.body.aircraftsState, expectedDataState)
      assert.deepStrictEqual(res.body.isClientSyncedWithServer, false)
    })
  })

})

// READ
describe('GET /aircraft', () => {
  before(async () => {
    await seedTest.deleteAll()
    await seedTest.c17aer()
    await seedTest.c17a()
    await seedTest.demo()
  })

  it('Should return demo aircraft for users with roles < 1', (done: Done) => {
    req(server)
      .get('/aircraft')
      .set('authorization', role0e)
      .expect(200)
      .expect((res) => {
        assert(res.body.length == 1)
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

describe('GET /aircraft/deep', () => {
  before(async () => {
    await seedTest.deleteAll()
    await seedTest.c17aer()
    await seedTest.c17a()
    await seedTest.demo()
  })

  it('Should return demo for users with roles < 1', (done: Done) => {
    req(server)
      .get('/aircraft/deep')
      .set('authorization', role0e)
      .expect(200)
      .expect((res) => {
        assert(res.body.aircrafts.length == 1)
      })
      .end(done)
  })

  it('Should return [].length == 2 for users with roles > 2 on 2 aircraft', (done: Done) => {
    req(server)
      .get('/aircraft/deep')
      .set('authorization', role2e)
      .expect(200)
      .expect((res) => {
        assert(res.body.aircrafts.length == 2)
      })
      .end(done)
  })

  it('Should return [].length == 1 for users with roles > 2 on 1 aircraft', (done: Done) => {
    req(server)
      .get('/aircraft/deep')
      .set('authorization', role2OnAir1e)
      .expect(200)
      .expect((res) => {
        assert(res.body.aircrafts.length == 1)
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
    await seedTest.c17aer()
    await seedTest.c17a()
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
        assert.deepStrictEqual(didFind, {...updateAir, deepHashId: '0'})
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
    await seedTest.c17aer()
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
