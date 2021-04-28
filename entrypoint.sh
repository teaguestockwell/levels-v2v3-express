echo $PG_USER
echo $PG_PASSWORD
echo $PG_DATABASE
export DATABASE_URL="postgresql://${PG_USER}:${PG_PASSWORD}@${PG_DATABASE}:5432"
export PORT="${PORT:-8080}"
echo "the db url from entrypoint: ${DATABASE_URL}"

echo "waiting for DB to accept conenctions"
npx ts-node --transpile-only wait.ts

# echo "generating prisma types from prisma.schema into node_modules"
# npx prisma generate

echo "init db schema"
npx prisma migrate dev --name init --preview-feature

# echo "running tests"
# npx nyc --reporter=lcovonly mocha -r ts-node/register test/**/*.test.ts --no-timeout --exit

echo "rm test data && seed prod data"
npx ts-node --transpile-only prisma/seed.ts

echo "starting server"
npx ts-node --transpile-only server.ts