import { Done } from "mocha";
import { seedTest } from "../prisma/seed_test";
import server from "../server";
import req from 'supertest'
import { role2e, role3e } from "./utils";

describe('GET /log', () => {
  before(async () => await seedTest.logs())

  it('returns a log for user with role >=3', (done: Done) => {
    req(server)
      .get('/log?pageIdx=0')
      .set('authorization', role3e)
      .expect(200)
      .end(done)
  })

  it('403 for user with role <=2', (done: Done) => {
    req(server)
      .get('/log?pageIdx=0')
      .set('authorization', role2e)
      .expect(403)
      .end(done)
  })

  it('400 for invalid query', (done: Done) => {
    req(server)
      .get('/log?pageIdx=0ss')
      .set('authorization', role3e)
      .expect(400)
      .end(done)
  })
})