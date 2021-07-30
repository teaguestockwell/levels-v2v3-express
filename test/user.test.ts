import {Done} from 'mocha'
import req from 'supertest'
import assert from 'assert'
import server from '../server'
import {role0e, role1e, role2e, role3e, role4e, role5e, roleSuper1e} from './utils'
import {User} from '@prisma/client'
import {query} from '../prisma/query'
import {seedTest} from '../prisma/seed_test'

const newUserRole1: User = {
  updated: new Date(),
  updatedBy: 'developer',
  aircraftId: 1,
  userId: 0, // 0 tells upsert that user was created by ui, and to assign them a userId
  name: 'newb@name',
  role: 1,
}

// READ
describe('GET /user', () => {
  before(async () => {
    await seedTest.deleteAll()
    await seedTest.c17aer()
  })

  it('Should return users of a given aircraft when request.user.role >= 2', (done: Done) => {
    req(server)
      .get('/user?aircraftId=1')
      .set('authorization', role2e)
      .expect(200)
      .expect((res) => {
        assert(res.body.length > 1)
      })
      .end(done)
  })

  it('Should deny requests that have an access level < 1', (done: Done) => {
    req(server)
      .get('/user?aircraftId=1')
      .set('authorization', role0e)
      .expect(403)
      .end(done)
  })
})

// CREATE || UPDATE
describe('PUT /user', () => {
  const seededUserRole0: User = {
    updated: new Date(),
    updatedBy: 'developer',
    aircraftId: 1,
    userId: 1,
    name: 'role0@test.com',
    role: 2, // updating role 0 to role 2
  }

  const seededSuperUser0: User = {
    updated: new Date(),
    updatedBy: 'developer',
    aircraftId: 1,
    userId: 11,
    name: 'super.user0@test.com',
    role: 3,
  }

  const demoteSuperUser0 = {...seededSuperUser0, role: 3}
  const promoteSuperUser0 = {...demoteSuperUser0, role: 100}

  const newUserRole10: User = {
    updated: new Date(),
    updatedBy: 'developer',
    aircraftId: 1,
    userId: 0, // 0 tells upsert that user was created by ui, and to assign them a userId
    name: 'newb@name',
    role: 10, // fake role to assert this user has higher role than request maker
  }

  const newUserRoleNeg1: User = {
    updated: new Date(),
    updatedBy: 'developer',
    aircraftId: 1,
    userId: 0, // 0 tells upsert that user was created by ui, and to assign them a userId
    name: 'newb2@name',
    role: -1,
  }

  const newUserRole101: User = {
    updated: new Date(),
    updatedBy: 'developer',
    aircraftId: 1,
    userId: 0, // 0 tells upsert that user was created by ui, and to assign them a userId
    name: 'newb3@name',
    role: 101,
  }

  const mockDuplicateUserUpdate: User = {
    updated: new Date(),
    updatedBy: 'developer',
    aircraftId: 1,
    userId: 4, // this corresponds to name role1@test.com
    name: 'role0@test.com', // cannot put to duplicate user
    role: 2,
  }

  const testCase = {
    updated: new Date(),
    updatedBy: 'developer',
    aircraftId: 1,
    userId: 0, // 0 tells upsert that user was created by ui, and to assign them a userId
    name: 'John.Doe@Email.Com',
    role: 1
  }


  before(async () => {
    await seedTest.deleteAll()
    await seedTest.c17aer()
  })

  it('Should create new users', (done: Done) => {
    req(server)
      .put('/user')
      .set('authorization', role3e)
      .send(newUserRole1)
      .expect(200)
      .expect(async () => {
        const updated: User = await query.readUserAtUserId(newUserRole1.userId)
        assert.deepStrictEqual(updated, newUserRole1)
      })
      .end(done)
  })

  it('User emails are not case sensitive', (done: Done) => {
    req(server)
      .put('/user')
      .set('authorization', role3e)
      .send(testCase)
      .expect(200)
      .expect(async () => {
        const updated: User = await query.readUserAtName_AircraftId('john.doe@email.com', 1)
        assert.deepStrictEqual({...updated, userId: 0}, {...testCase, name: 'john.doe@email.com'})
      })
      .end(done)
  })

  it('Should deny reqs that have access level < 0', (done: Done) => {
    req(server)
      .put('/user')
      .set('authorization', role3e)
      .send(newUserRoleNeg1)
      .expect(400)
      .end(done)
  })

  it('Should deny reqs that have access level > 100', (done: Done) => {
    req(server)
      .put('/user')
      .set('authorization', role3e)
      .send(newUserRole101)
      .expect(400)
      .end(done)
  })

  it('Should deny reqs that have access level < 2', (done: Done) => {
    req(server)
      .put('/user')
      .set('authorization', role1e)
      .send(newUserRole1)
      .expect(403)
      .end(done)
  })

  it('Should deny reqs putting users with >= requesters role', (done: Done) => {
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
        const updated: User = await query.readUserAtUserId(
          seededUserRole0.userId
        )
        assert.deepStrictEqual(updated, seededUserRole0)
      })
      .end(done)
  })

  it('Should 400 request that put users that dont have unique name-aircraft', (done: Done) => {
    req(server)
      .put('/user')
      .set('authorization', role4e)
      .send(mockDuplicateUserUpdate)
      .expect(400)
      .expect(async () => {
        const db = await query.readUserAtUserId(mockDuplicateUserUpdate.userId)
        assert.notStrictEqual(db.name, mockDuplicateUserUpdate.name)
      })
      .end(done)
  })

  it('users may demote other users if they have role >= them', (done: Done) => {
    req(server)
      .put('/user')
      .set('authorization', roleSuper1e)
      .send(demoteSuperUser0)
      .expect(200)
      .expect(async () => {
        const updated: User = await query.readUserAtUserId(
          seededUserRole0.userId
        )
        assert.deepStrictEqual(updated, {...seededUserRole0, role: 3})
      })
      .end(done)
  })

  it('users may promote other users if they have role >= them', (done: Done) => {
    req(server)
      .put('/user')
      .set('authorization', roleSuper1e)
      .send(promoteSuperUser0)
      .expect(200)
      .expect(async () => {
        const updated: User = await query.readUserAtUserId(
          seededUserRole0.userId
        )
        assert.deepStrictEqual(updated, {...seededUserRole0, role: 100})
      })
      .end(done)
  })
})

// DELETE
describe('DELETE /user', () => {
  before(async () => {
    await seedTest.deleteAll()
    await seedTest.c17aer()
  })

  it('Should 403 when request.role < userId.role', (done: Done) => {
    req(server)
      .delete('/user?userId=7')
      .set('authorization', role1e)
      .expect(403)
      .end(done)
  })

  it('Should delete when request.role => userId.role', (done: Done) => {
    req(server)
      .delete('/user?userId=5')
      .set('authorization', role5e)
      .expect(200)
      .end(done)
  })
})
