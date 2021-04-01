import {seedTest} from '../prisma/seed_test'
import {role1e, role2e, role5e} from './utils'
import {Done} from 'mocha'
import req from 'supertest'
import assert from 'assert'
import server from '../server'
import {General, PrismaClient} from '@prisma/client'
//import query from '../prisma/query'

const prisma = new PrismaClient()

// READ
describe('GET /general', () => {
  before(async () => {
    await seedTest.deleteAll()
    await seedTest.C_17_A_ER()
    await seedTest.generals()
  })

  it('Should return general', (done: Done) => {
    req(server)
      .get('/general')
      .set('authorization', role1e)
      .expect(200)
      .expect(async (res) => {
        const actual = await prisma.general.findFirst({where: {role: 1}})
        assert.strictEqual(res.body, actual)
      })
      .end(done)
  })
})

// UPDATE || CREATE
describe('PUT /general', () => {
  const updateGeneral: General = {
    role: 1,
    name: 'welcome', // update name
    body: 'body', //update body
    names: ['name1', 'name2'],
    iconDatas: [123, 342134],
    urls: ['url 1', 'url2 '],
  }

  const newGeneral: General = {
    role: 7,
    name: 'welcome', // update name
    body: 'body', //update body
    names: ['name1', 'name2'],
    iconDatas: [123, 342134],
    urls: ['url 1', 'url2 '],
  }

  before(async () => {
    await seedTest.deleteAll()
    await seedTest.C_17_A_ER()
    await seedTest.generals()
  })

  it('Should return 200 and update where general is unquique && req.role >= 5', (done: Done) => {
    req(server)
      .put('/general')
      .set('authorization', role5e)
      .send(updateGeneral)
      .expect(200)
      .end(done)
  })

  it('Should return 200 and create where general is unquique && req.role >= 5', (done: Done) => {
    req(server)
      .put('/general')
      .set('authorization', role5e)
      .send(newGeneral)
      .expect(200)
      .expect(async () => {
        const found = await prisma.general.findUnique({
          where: {role: 7},
        })
        assert.deepStrictEqual(found, newGeneral)
      })
      .end(done)
  })

  it('Should return 403 where req.role <= 4 on aircraft', (done: Done) => {
    req(server)
      .put('/general')
      .set('authorization', role2e)
      .send(updateGeneral)
      .expect(403)
      .end(done)
  })
})

// DELETE
describe('DELETE /general', () => {
  before(async () => {
    await seedTest.deleteAll()
    await seedTest.C_17_A_ER()
    await seedTest.generals()
  })

  it('Should 403 where req.role <= 5 on aircraft', (done: Done) => {
    req(server)
      .delete('/general?generalid=1')
      .set('authorization', role2e)
      .expect(403)
      .end(done)
  })

  it('Should 200 and delete where req.role >= 5 on aircraft', (done: Done) => {
    req(server)
      .delete('/general?generalid=1')
      .set('authorization', role5e)
      .expect(200)
      .expect(async () => {
        let didFind: boolean
        await prisma.general
          .findUnique({where: {role: 1}})
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
