### Testing with Prisma

1. Instead of keeping track of the state within the DB between tests, its easier to wipe it entirely and re seed.
2. ./utils contains a mock of users with different roles. See /prisma/query.ts ln: 240 for an example of reading an email from the JWT
