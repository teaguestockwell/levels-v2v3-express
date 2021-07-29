export DATABASE_URL="postgresql://${PG_USER}:${APP_DB_ADMIN_PASSWORD}@${PGHOST}:${PGPORT}"
export PORT="${PORT:-8080}"
# echo $DATABASE_URL

echo "waiting for DB to accept conenctions"
node wait.js

# Will reset everything
echo "applying migrations with db reset"
npx prisma db push --force-reset

# echo "reseeding db"
# node prisma/reseed.js

# For prod mirgation
echo "applying migrations prod"
npx prisma migrate deploy


echo "starting prod build server"
node server.js