###Some notes about working with Prisma 2

1. Autoincrement fields will break if you create and specify the value of the autoincrement field
2. Seeding is done ala carte to accommodate tests.
3. Wiping seed data between tests is preferred, see: ./seed_test ln:5
4. Cascading deletes are not currently supported when generating schema from .prisma see: [docs](https://www.prisma.io/docs/guides/general-guides/database-workflows/cascading-deletes/postgresql) they need to be configured manually in DB
5.
