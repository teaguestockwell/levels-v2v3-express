###Some notes about working with Prisma 2

1. Autoincrement fields will break if you create and specify the value of the autoincrement field
2. Seeding is done ala carte to acomadate tests.
3. Wiping seed data inbetween tests is prefered, see: ./seed_test ln:5
4. Cascading deletes are not currently supported when generating schema from .prisma see: [docs](https://www.prisma.io/docs/guides/general-guides/database-workflows/cascading-deletes/postgresql) they need to be configured manualy in DB
5.
