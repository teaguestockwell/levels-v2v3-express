import {seedTest} from '../prisma/seed_test'
import {role0e, role1e, role2e, role3e} from './utils'
import {Done} from 'mocha'
import req from 'supertest'
import assert from 'assert'
import server from '../server'
import {Glossary} from '@prisma/client'
import {client as prisma} from '../prisma/client'

// READ
describe('GET /glossary', () => {
  before(async () => {
    await seedTest.deleteAll()
    await seedTest.C_17_A_ER()
  })

  it('Should return glossarys[] of an aircraft given req.role on that aircraft >= 1', (done: Done) => {
    req(server)
      .get('/glossary?aircraftId=1')
      .set('authorization', role1e)
      .expect(200)
      .expect((res) => {
        assert(res.body.length != 0)
      })
      .end(done)
  })

  it('Should 403 where req.role <1 on aircraft', (done: Done) => {
    req(server)
      .get('/glossary?aircraftId=1')
      .set('authorization', role0e)
      .expect(403)
      .end(done)
  })
})

// UPDATE || CREATE
describe('PUT /glossary', () => {
  const updateGloss: Glossary = {
    updatedBy: 'developer',
    updated: new Date(),
    aircraftId: 1,
    glossaryId: 1,
    name: 'update glossary name',
    body: 'update info here',
  }

  const updateGlossNonUnique: Glossary = {
    updatedBy: 'developer',
    updated: new Date(),
    aircraftId: 1,
    glossaryId: 1,
    name: '%MAC',
    body: 'update info here',
  }

  const newGloss: Glossary = {
    updatedBy: 'developer',
    updated: new Date(),
    aircraftId: 1,
    glossaryId: 0, // 0 means this is a new glossary - no aircraftId has been assined by db
    name: 'new glossary name',
    body: 'info here',
  }

  before(async () => {
    await seedTest.deleteAll()
    await seedTest.C_17_A_ER()
  })

  it('Should return 200 and update where gloss is unquique && req.role >= 3', (done: Done) => {
    req(server)
      .put('/glossary')
      .set('authorization', role3e)
      .send(updateGloss)
      .expect(200)
      .end(done)
  })

  it('Should return 200 and create where gloss is unquique && req.role >= 3', (done: Done) => {
    req(server)
      .put('/glossary')
      .set('authorization', role3e)
      .send(newGloss)
      .expect(200)
      .expect(async () => {
        const name_aircraftId = {
          aircraftId: newGloss.aircraftId,
          name: newGloss.name,
        }
        const found = await prisma.glossary.findUnique({
          where: {name_aircraftId},
        })
        assert.deepStrictEqual(found.name, newGloss.name)
        assert.deepStrictEqual(found.body, newGloss.body)
        assert.deepStrictEqual(found.aircraftId, newGloss.aircraftId)
      })
      .end(done)
  })

  it('Should return 403 where req.role <= 2 on aircraft', (done: Done) => {
    req(server)
      .put('/glossary')
      .set('authorization', role2e)
      .send(updateGloss)
      .expect(403)
      .end(done)
  })

  it('Should return 400 where glossary name and aircraft aircraftId is not unique UPDATE', (done: Done) => {
    req(server)
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
    req(server)
      .delete('/glossary?glossaryId=1')
      .set('authorization', role2e)
      .expect(403)
      .end(done)
  })

  it('Should 200 and delete where req.role <= 2 on aircraft', (done: Done) => {
    req(server)
      .delete('/glossary?glossaryId=1')
      .set('authorization', role3e)
      .expect(200)
      .expect(async () => {
        let didFind: boolean
        await prisma.glossary
          .findUnique({where: {glossaryId: 1}})
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
