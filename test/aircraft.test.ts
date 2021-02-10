import { Done } from 'mocha'
import req from 'supertest'
import assert from 'assert'
import app from '../server'
import {role0e, role1e, role2e, role3e, role4e} from './utils'
import { Prisma, User } from '@prisma/client'
import service from '../db/services'

// Create

// Read
// Read
describe('GET /aircraft', () => {
  
  it('Should return empty[] for users with roles < 1', (done:Done) => {
    req(app)
    .get('/aircraft')
    .set('authorization', role0e)
    .expect(200)
    .expect((res)=>{assert(res.body.length == 0)})
    .end(done)
  })

})


// Update

// Delete

