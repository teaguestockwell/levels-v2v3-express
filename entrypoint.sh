echo "waiting for DB to accept conenctions"
sleep 5 

echo "generating prisma types from prisma.schema into node_modules"
npx prisma generate

echo "init db schema"
npx prisma migrate dev --name init --preview-feature

echo "running tests"
npx nyc --reporter=lcovonly mocha -r ts-node/register test/**/*.test.ts --no-timeout --exit

echo "rm test data && seed prod data"
npx ts-node prisma/seed.ts

echo "starting server"
npx ts-node server.ts