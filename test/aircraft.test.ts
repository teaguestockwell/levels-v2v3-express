import {Done} from 'mocha'
import req from 'supertest'
import assert from 'assert'
import server from '../server'
import {role0e, role2e, role3e, role4e, role2OnAir1e} from './utils'
import {
  Aircraft,
  Cargo,
  ConfigCargo,
  Glossary,
  Tank,
  User,
  PrismaClient,
} from '@prisma/client'
import query from '../prisma/query'
import {seedTest} from '../prisma/seed_test'

const prisma = new PrismaClient()

const createAir: Aircraft = {
  id: 0,
  name: 'new',
  fs0: 100,
  fs1: 2000,
  mom0: 5000,
  mom1: 10000,
  weight0: 100000,
  weight1: 200000,
  cargoweight1: 20000,
  lemac: 700,
  mac: 90,
  mommultiplyer: 10000,
}

const createAirNonUniqueName: Aircraft = {
  id: 0,
  name: 'C-17A-ER',
  fs0: 100,
  fs1: 2000,
  mom0: 5000,
  mom1: 10000,
  weight0: 100000,
  weight1: 200000,
  cargoweight1: 20000,
  lemac: 700,
  mac: 90,
  mommultiplyer: 10000,
}

const updateAirNonUniqueName: Aircraft = {
  id: 1,
  name: 'C-17A', // update from C-17A-ER to reflect a non unique name
  fs0: 100,
  fs1: 2000,
  mom0: 5000,
  mom1: 10000,
  weight0: 100000,
  weight1: 200000,
  cargoweight1: 20000,
  lemac: 700,
  mac: 90,
  mommultiplyer: 10000,
}

const updateAir: Aircraft = {
  id: 1,
  name: 'C-17A-Er', // update 'r'to be lowercase
  fs0: 80.5,
  fs1: 2168,
  mom0: 9999,
  mom1: 50000,
  weight0: 260000,
  weight1: 300000,
  cargoweight1: 300000,
  lemac: 793.6,
  mac: 309.5,
  mommultiplyer: 10000,
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

// UPDATE || CREATE
describe('PUT /aircraft', () => {
  // before each prevents bade state when modifys unique constrains
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
        const didfind = await prisma.aircraft.findUnique({
          where: {id: updateAir.id},
        })
        assert.deepStrictEqual(didfind, updateAir)
      })
      .end(done)
  })

  it('Should 200 and create when the acft is valid, and req.highestrole >= 3', (done: Done) => {
    req(server)
      .put('/aircraft')
      .set('authorization', role3e)
      .send(createAir)
      .expect(200)
      .expect(async () => {
        const didfind = await prisma.aircraft.findUnique({
          where: {name: createAir.name},
          include: {users: true},
        })

        // if req user creates air, they will have role 4 on it
        assert.deepStrictEqual(didfind.users[0].role, 4)
        assert.deepStrictEqual(didfind.name, createAir.name)
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
  let air1

  before(async () => {
    await seedTest.deleteAll()
    await seedTest.C_17_A_ER()
    air1 = await query.readAircraftAtID(1)
  })

  it('Should 403 requests whos role @ aircraft <= 2', (done: Done) => {
    req(server)
      .delete('/aircraft')
      .set('authorization', role2e)
      .send({id: 1})
      .expect(403)
      .end(done)
  })

  it('Should delete all recusivly where requests role @ aircraft > 2', (done: Done) => {
    req(server)
      .delete('/aircraft')
      .set('authorization', role4e)
      .send({id: 1})
      .expect(200)
      .expect(async () => {
        const didFind: boolean[] = []

        // did the top lvl delete?
        try {
          await query.readAircraftAtID(1)
          didFind.push(true)
        } catch (e) {
          didFind.push(false)
        }

        // did users cascade delete
        const users: Promise<boolean>[] = await air1.users.map(
          async (u: User) => {
            try {
              await query.readUserAtUserID(u.userid)
              didFind.push(true)
            } catch (e) {
              didFind.push(false)
            }
          }
        )

        // did glossarys cascade delete
        const glossarys: Promise<boolean>[] = await air1.glossarys.map(
          async (g: Glossary) => {
            try {
              await query.readGlossaryAtGlossaryID(g.glossaryid)
              didFind.push(true)
            } catch (e) {
              didFind.push(false)
            }
          }
        )

        // did tanks cascade delete
        const tanks: Promise<boolean>[] = await air1.tanks.map(
          async (t: Tank) => {
            try {
              await query.readTankAtTankID(t.tankid)
              didFind.push(true)
            } catch (e) {
              didFind.push(false)
            }
          }
        )

        // did configs cascasde delete
        let conCargo: Promise<boolean>[] = []
        const configs: Promise<boolean>[] = await air1.configs.map(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          async (c: any) => {
            // did cargo configs cascade delete
            conCargo = await c.configcargos.map(async (cc: ConfigCargo) => {
              try {
                await query.readConfigCargoAtConfigCaargoId(cc.configcargoid)
                didFind.push(true)
              } catch (e) {
                didFind.push(false)
              }
            })

            try {
              await query.readConfigAtConfigID(c.configid)
              didFind.push(true)
            } catch (e) {
              didFind.push(false)
            }
          }
        )

        // did cargos cascade delete
        const cargos: Promise<boolean>[] = await air1.cargos.map(
          async (c: Cargo) => {
            try {
              await query.readConfigCargoAtConfigCaargoId(c.cargoid)
              didFind.push(true)
            } catch (e) {
              didFind.push(false)
            }
          }
        )

        const allPromises: Promise<boolean>[] = cargos.concat(
          configs,
          conCargo,
          tanks,
          glossarys,
          users
        )
        await Promise.all(allPromises)
        console.log(didFind.length + ' did find length')

        const foundTrue: boolean = didFind.includes(true)
        assert.deepStrictEqual(foundTrue, false)
      })
      .end(done)
  })
})
