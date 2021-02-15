import {seedTest} from '../prisma/seed_test'
import {role0e, role1e, role2e, role3e} from './utils'
import {Done} from 'mocha'
import req from 'supertest'
import assert from 'assert'
import app from '../server'
import {Glossary, PrismaClient} from '@prisma/client'
import {deepStrictEqual} from 'assert'
//import query from '../prisma/query'

const prisma = new PrismaClient()

// CREATE
describe('POST /glossary', () => {
  const newGloss: Glossary = {
    aircraftid: 1,
    glossaryid: 0, // 0 means this is a new glossary - no id has been assined by db
    title: 'new glossary title',
    body: 'info here',
  }

  let oldGloss: Glossary

  before(async () => {
    await seedTest.deleteAll()
    await seedTest.C_17_A_ER()
    oldGloss = await prisma.glossary.findFirst()
  })

  it('Should 200 where req.role on aircrat >= 2', (done: Done) => {
    req(app)
      .post('/glossary')
      .set('authorization', role3e)
      .send(newGloss)
      .expect(200)
      .expect(async () => {
        const aircraftid: number = newGloss.aircraftid
        const title: string = newGloss.title
        const title_aircraftid = {aircraftid: aircraftid, title: title}

        const dbRead = await prisma.glossary.findUnique({
          where: {title_aircraftid},
        })
        deepStrictEqual(dbRead, newGloss)
      })
      .end(done)
  })

  it('Should 403 where req.role on aircrat <= 2', (done: Done) => {
    req(app)
      .post('/glossary')
      .set('authorization', role2e)
      .send(newGloss)
      .expect(403)
      .end(done)
  })

  it('Should 400 where req.role on aircrat <= 2, and gloss title is not unique to aircraft id', (done: Done) => {
    req(app)
      .post('/glossary')
      .set('authorization', role3e)
      .send(oldGloss)
      .expect(400)
      .end(done)
  })
})

// READ
describe('GET /glossary', () => {
  before(async () => {
    await seedTest.deleteAll()
    await seedTest.C_17_A_ER()
  })

  it('Should return glossarys[] of an aircraft given req.role on that aircraft >= 1', (done: Done) => {
    req(app)
      .get('/glossary')
      .set('authorization', role1e)
      .send({aircraftid: 1}) // query all gloss on air
      .expect(200)
      .expect((res) => {
        assert(res.body.length != 0)
      })
      .end(done)
  })

  it('Should 403 where req.role <1 on aircraft', (done: Done) => {
    req(app)
      .get('/glossary')
      .set('authorization', role0e)
      .send({aircraftid: 1}) // query all gloss on air
      .expect(403)
      .end(done)
  })
  // UI will handle this better { onPress: MaterialAppRouter.push(SomePage(this))}

  // it('Should return glossarys of ain aircraft where req.role on that aircraf >= 1', (done: Done) => {
  //   req(app)
  //     .get('/glossary')
  //     .set('authorization', role1e)
  //     .send({aircraftid: 1, glossaryid: 1}) // query one glossary one air
  //     .expect(200)
  //     .expect(async (res) => {
  //       const expected = await query.readGlossaryAtGlossaryID(1)
  //       assert.deepStrictEqual(res.body.length, [expected])
  //     })
  //     .end(done)
  // })
})

// UPDATE
describe('PUT /glossary', () => {
  const updateGloss: Glossary = {
    aircraftid: 1,
    glossaryid: 1,
    title: 'update glossary title',
    body: 'update info here',
  }

  const updateGlossNonUnique: Glossary = {
    aircraftid: 1,
    glossaryid: 1,
    title: '%MAC',
    body: 'update info here',
  }

  before(async () => {
    await seedTest.deleteAll()
    await seedTest.C_17_A_ER()
  })

  it('Should return 200 where gloss is unquique && req.role >= 3', (done: Done) => {
    req(app)
      .put('/glossary')
      .set('authorization', role3e)
      .send(updateGloss)
      .expect(200)
      .end(done)
  })

  it('Should return 403 where req.role <= 2 on aircraft', (done: Done) => {
    req(app)
      .put('/glossary')
      .set('authorization', role2e)
      .send(updateGloss)
      .expect(403)
      .end(done)
  })

  it('Should return 400 where glossary title and aircraft id is not unique', (done: Done) => {
    req(app)
      .put('/glossary')
      .set('authorization', role3e)
      .send(updateGlossNonUnique)
      .expect(400)
      .end(done)
  })
})

// DELETE
describe('DELETE /glossary', () => {
  before(async () => {
    await seedTest.deleteAll()
    await seedTest.C_17_A_ER()
  })

  it('Should 403 where req.role <= 2 on aircraft', (done: Done) => {
    req(app)
      .delete('/glossary')
      .set('authorization', role2e)
      .send({glossaryid: 1})
      .expect(403)
      .end(done)
  })

  it('Should 200 and delete where req.role <= 2 on aircraft', (done: Done) => {
    req(app)
      .delete('/glossary')
      .set('authorization', role3e)
      .send({glossaryid: 1})
      .expect(200)
      .expect(async () => {
        let didFind: boolean
        await prisma.glossary
          .findUnique({where: {glossaryid: 1}})
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
