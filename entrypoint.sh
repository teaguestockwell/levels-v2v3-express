export DATABASE_URL="postgresql://${PG_USER}:${APP_DB_ADMIN_PASSWORD}@${PGHOST}:${PGPORT}"
export PORT="${PORT:-8080}"
# echo $DATABASE_URL

echo "waiting for DB to accept conenctions"
npx ts-node --transpile-only wait.ts

# echo "generating prisma types from prisma.schema into node_modules"
# npx prisma generate

# echo "init db schema"
# Mainly for use in Development, creates shadow db: no permissions in aws
# npx prisma migrate dev --preview-feature 

# Will reset everything
echo "applying migrations"
npx prisma migrate reset --force --skip-generate --preview-feature

# The normal production work flow
# npx prisma migrate deploy --preview-feature 

# echo "running tests"
# npx nyc --reporter=lcovonly mocha -r ts-node/register test/**/*.test.ts --no-timeout --exit

echo "reseeding db"
npx ts-node --transpile-only prisma/reseed.ts

echo "starting server"
npx ts-node --transpile-only server.ts