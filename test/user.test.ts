import {Done} from 'mocha'
import req from 'supertest'
import assert from 'assert'
import server from '../server'
import {role1e, role2e, role3e, role4e} from './utils'
import {User} from '@prisma/client'
import query from '../prisma/query'
import {seedTest} from '../prisma/seed_test'

const newUserRole1: User = {
  aircraftid: 1,
  userid: 0, // 0 tells upsert that user was created by ui, and to assign them a userid
  email: 'newb@email',
  role: 1,
}

// READ
describe('GET /user', () => {
  before(async () => {
    await seedTest.deleteAll()
    await seedTest.C_17_A_ER()
  })
  // after(async () => {})

  it('Should return all users given empty body && request.user.role >= 2', (done: Done) => {
    req(server)
      .get('/user')
      .set('authorization', role2e)
      //.send()
      .expect(200)
      .expect((res) => {
        assert(res.body.length > 1)
      })
      .end(done)
  })

  it('Should return users of a given aircraft when request.user.role >= 2', (done: Done) => {
    req(server)
      .get('/user')
      .set('authorization', role2e)
      .send({aircraftid: 1})
      .expect(200)
      .expect((res) => {
        assert(res.body.length > 1)
      })
      .end(done)
  })

  it('Should deny requests that have an accses level < 2', (done: Done) => {
    req(server)
      .get('/user')
      .set('authorization', role1e)
      .send({aircraftid: 1})
      .expect(403)
      .end(done)
  })
})

// CREATE || UPDATE
describe('PUT /user', () => {
  const seededUserRole0: User = {
    aircraftid: 1,
    userid: 1,
    email: 'role0@test.com',
    role: 2, // updating role 0 to role 2
  }

  const newUserRole10: User = {
    aircraftid: 1,
    userid: 0, // 0 tells upsert that user was created by ui, and to assign them a userid
    email: 'newb@email',
    role: 10, // fake role to assert this user has higher role than request maker
  }

  const mockDuplicateUserUpdate: User = {
    aircraftid: 1,
    userid: 4, // this coresponds to email role1@test.com
    email: 'role0@test.com', // cannot put to duplicate user
    role: 2,
  }

  before(async () => {
    await seedTest.deleteAll()
    await seedTest.C_17_A_ER()
  })

  it('Should deny reqs that have accses level < 2', (done: Done) => {
    req(server)
      .put('/user')
      .set('authorization', role1e)
      .send(newUserRole1)
      .expect(403)
      .end(done)
  })

  it('Should deny reqs puting users with >= requesters role', (done: Done) => {
    req(server)
      .put('/user')
      .set('authorization', role2e)
      .send(newUserRole10)
      .expect(403)
      .end(done)
  })

  it('Should update existing users', (done: Done) => {
    req(server)
      .put('/user')
      .set('authorization', role3e)
      .send(seededUserRole0)
      .expect(200)
      .expect(async () => {
        const updated: User = await query.readUserAtUserID(
          seededUserRole0.userid
        )
        assert.deepStrictEqual(updated, seededUserRole0)
      })
      .end(done)
  })

  it('Should create new users', (done: Done) => {
    req(server)
      .put('/user')
      .set('authorization', role3e)
      .send(newUserRole1)
      .expect(200)
      .expect(async () => {
        const updated: User = await query.readUserAtUserID(newUserRole1.userid)
        assert.deepStrictEqual(updated, newUserRole1)
      })
      .end(done)
  })

  it('Should 400 request that put users that dont have unique email-aircraft', (done: Done) => {
    req(server)
      .put('/user')
      .set('authorization', role4e)
      .send(mockDuplicateUserUpdate)
      .expect(400)
      .expect(async () => {
        const db = await query.readUserAtUserID(mockDuplicateUserUpdate.userid)
        assert.notStrictEqual(db.email, mockDuplicateUserUpdate.email)
      })
      .end(done)
  })
})

// DELETE
describe('DELETE /user', () => {
  before(async () => {
    await seedTest.deleteAll()
    await seedTest.C_17_A_ER()
  })

  it('Should 403 when reqest.role <= userid.role', (done: Done) => {
    req(server)
      .delete('/user')
      .set('authorization', role1e)
      .send({userid: 7})
      .expect(403)
      .end(done)
  })

  it('Should delete when reqest.role > userid.role', (done: Done) => {
    req(server)
      .delete('/user')
      .set('authorization', role4e)
      .send({userid: 6})
      .expect(200)
      .end(done)
  })
})
