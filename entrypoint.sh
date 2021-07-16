export DATABASE_URL="postgresql://${PG_USER}:${APP_DB_ADMIN_PASSWORD}@${PGHOST}:${PGPORT}"
export PORT="${PORT:-8080}"
# echo $DATABASE_URL

echo "waiting for DB to accept conenctions"
node wait.js

# echo "generating prisma types from prisma.schema into node_modules"
# npx prisma generate

# echo "init db schema"
# Mainly for use in Development, creates shadow db: no permissions in aws
# npx prisma migrate dev --preview-feature 

# Will reset everything
echo "applying migrations"
npx prisma db push --force-reset

# The normal production work flow
# npx prisma migrate deploy --preview-feature 

# echo "running tests"
# npx nyc --reporter=lcovonly mocha -r ts-node/register test/**/*.test.ts --no-timeout --exit

echo "reseeding db"
node prisma/reseed.js

echo "starting prod build server"
node server.js