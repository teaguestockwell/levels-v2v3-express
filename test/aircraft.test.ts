import {Done} from 'mocha'
import req from 'supertest'
import assert from 'assert'
import app from '../server'
import {role0e, role1e, role2e, role3e, role4e, role2OnAir1e} from './utils'
import {Aircraft, Cargo, Config, ConfigCargo, Glossary, Prisma, Tank, User, PrismaClient} from '@prisma/client'
import query from '../prisma/query'

const prisma = new PrismaClient()

// Create / UPDATE / POST


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
      .set('authorization', role3e)
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
