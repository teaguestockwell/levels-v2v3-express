import { Done } from 'mocha'
import req from 'supertest'
import assert, {strictEqual} from 'assert'
import app from '../../server'
import {role0e, role1e, role2e, role3e, role4e} from '../utils'

describe('GET /db/user', () => {
  it('Should return all users given request.user.role >= 2', (done:Done) => {
    req(app)
    .get('/db/user')
    .set('authorization', role2e)
    //.send()
    .expect(200)
    .end(done)
  })
})