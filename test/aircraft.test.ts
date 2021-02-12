import {Done} from 'mocha'
import req from 'supertest'
import assert from 'assert'
import app from '../server'
import {role0e, role1e, role2e, role3e, role4e, role2OnAir1e} from './utils'
import {Aircraft, Cargo, Config, ConfigCargo, Glossary, Prisma, Tank, User, PrismaClient} from '@prisma/client'
import query from '../prisma/query'

const prisma = new PrismaClient()

const createAir:Aircraft = {
  id: 0,
  name: 'new air',
  fs0: 100,
  fs1: 2000,
  mom0: 5000,
  mom1: 10000,
  weight0: 100000,
  weight1: 200000,
  cargoweight1: 20000,
  lemac: 700,
  mac: 90,
  mommultiplyer: 10000
}

const createAirNonUniqueName:Aircraft = {
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
  mommultiplyer: 10000
}

const updateAirNonUniqueName:Aircraft = {
  id: 1,
  name: 'C-17A', // update the C-17A to reflect non unique er name
  fs0: 100,
  fs1: 2000,
  mom0: 5000,
  mom1: 10000,
  weight0: 100000,
  weight1: 200000,
  cargoweight1: 20000,
  lemac: 700,
  mac: 90,
  mommultiplyer: 10000
}

const updateAir:Aircraft = {
  id:1,
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

// POST / CREATE
describe('POST /aircraft', () => {
  it('Should 403 if the req.highest role <= 2', (done:Done)=>{
    req(app)
    .post('/aircraft')
    .set('authorization', role2e)
    .send(createAir)
    .expect(403)
    .end(done)
  })

  it('Should 400 if the name is not unique', (done:Done)=>{
    req(app)
    .post('/aircraft')
    .set('authorization', role3e)
    .send(createAirNonUniqueName)
    .expect(400)
    .end(done)
  })

  it('Should 200 when the acft is valid, and req.role >= 3', (done:Done)=>{
    req(app)
    .post('/aircraft')
    .set('authorization', role3e)
    .send(createAir)
    .expect(200)
    .expect(async (res) => {
      const didfind = await prisma.aircraft.findUnique({where:{name:createAir.name}})
      assert.deepStrictEqual(didfind,createAir)
    })
    .end(done)
  })

  after(async ()=>{
    await prisma.aircraft.delete({where:{name: createAir.name}})
  })
})

// Read
describe('GET /aircraft', () => {
  it('Should return empty[] for users with roles < 1', (done: Done) => {
    req(app)
      .get('/aircraft')
      .set('authorization', role0e)
      .expect(200)
      .expect((res) => {
        assert(res.body.length == 0)
      })
      .end(done)
  })

  it('Should return [].length == 2 for users with roles > 2 on 2 aircraft', (done: Done) => {
    req(app)
      .get('/aircraft')
      .set('authorization', role2e)
      .expect(200)
      .expect((res) => {
        assert(res.body.length == 2)
      })
      .end(done)
  })

  it('Should return [].length == 1 for users with roles > 2 on 1 aircraft', (done: Done) => {
    req(app)
      .get('/aircraft')
      .set('authorization', role2OnAir1e)
      .expect(200)
      .expect((res) => {
        assert(res.body.length == 1)
      })
      .end(done)
  })
})

describe('GET /aircraft/id', () => {
  it('Should deny users without roles to that aircraft', (done: Done) => {
    req(app)
      .get('/aircraft/1')
      .set('authorization', role0e)
      .expect(403)
      .end(done)
  })

  it('Should return Aircraft of id given user has roles to that id', (done: Done) => {
    req(app)
      .get('/aircraft/1')
      .set('authorization', role2OnAir1e)
      .expect(200)
      .expect(async (res) => {
        const air1 = await query.readAircraftAtID(1)
        assert.deepStrictEqual(res.body, air1)
      })
      .end(done)
  })
})

// PUT / UPDATE
describe('PUT /aircraft', ()=> {
  it('Should 403 if the req role <= 2', (done:Done)=>{
    req(app)
    .put('/aircraft')
    .set('authorization', role2e)
    .send(updateAir)
    .expect(403)
    .end(done)
  })

  it('Should 200 and update when the acft is valid, and req.role >= 3', (done:Done)=>{
    req(app)
    .put('/aircraft')
    .set('authorization', role3e)
    .send(updateAir)
    .expect(200)
    .expect(async (res) => {
      const didfind = await prisma.aircraft.findUnique({where:{id:updateAir.id}})
      assert.deepStrictEqual(didfind,updateAir)
    })
    .end(done)
  })

  it('Should 400 if the name is not unique', (done:Done)=>{
    req(app)
    .put('/aircraft')
    .set('authorization', role3e)
    .send(updateAirNonUniqueName)
    .expect(400)
    .end(done)
  })

  after(async ()=> {
    const after = updateAir;
    after.name = 'C-17A-ER' // revert Er to ER
    await query.updateAircraftShallow(after)
  })
})

// Delete
describe('DELETE /aircraft/id', () => {
  let air3;

  before(async () => {
    air3 = await query.readAircraftAtIDIncludeUsers(3)
  })

  it('Should 403 requests whos role @ aircraft <= 2', (done: Done) => {
    req(app)
      .delete('/aircraft/1')
      .set('authorization', role2e)
      .expect(403)
      .end(done)
  })

  it('Should delete all recusivly where requests role @ aircraft > 2', (done: Done) => {
    req(app)
      .delete('/aircraft/3')
      .set('authorization', role4e)
      .expect(200)
      .expect(async (res) => {
        const didFind: boolean[] = []

        // did the top lvl delete?
        try{
          await query.readAircraftAtID(3)
          didFind.push(true)
        } catch (e){didFind.push(false)}

        // did users cascade delete
        air3.users.forEach(async (u:User) => {
          try{
            await query.readUserAtUserID(u.userid)
            didFind.push(true)
          }catch (e){didFind.push(false)}
        });

        // did glossarys cascade delete
        air3.glossarys.forEach(async (g:Glossary) => {
          try{
            await query.readGlossaryAtGlossaryID(g.glossaryid)
            didFind.push(true)
          }catch (e){didFind.push(false)}
        });

        // did tanks cascade delete
        air3.tanks.forEach(async (t:Tank) => {
          try{
            await query.readTankAtTankID(t.tankid)
            didFind.push(true)
          }catch (e){didFind.push(false)}
        });

        // did configs cascasde delete
        air3.configs.forEach(async (c:any) => {

          // did cargo configs cascade delete
          c.configcargos.forEach(async(cc: ConfigCargo) => {
            try{
              await query.readConfigCargoAtCargoConfigID(cc.configcargoid)
              didFind.push(true)
            }catch (e){didFind.push(false)}
          });

          try{
            await query.readConfigAtConfigID(c.configid)
            didFind.push(true)
          }catch (e){didFind.push(false)}

        });

        // did cargos cascade delete
        air3.cargos.forEach(async (c:Cargo) => {
          try{
            await query.readConfigCargoAtCargoConfigID(c.cargoid)
            didFind.push(true)
          }catch (e){didFind.push(false)}
        })

        console.log(didFind.length)

        const foundTrue: boolean = didFind.includes(true)
        assert.deepStrictEqual(foundTrue, false)
      })
      .end(done)
  })
})
