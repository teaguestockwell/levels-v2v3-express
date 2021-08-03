export DATABASE_URL="postgresql://${PG_USER}:${APP_DB_ADMIN_PASSWORD}@${PGHOST}:${PGPORT}"
export PORT="${PORT:-8080}"
# echo $DATABASE_URL

echo "waiting for DB to accept conenctions"
node wait.js

if [ "${IS_LOCAL}" = "true" ]; then echo "reseting db and reseeding" && npx prisma generate && npx prisma db push --force-reset && node prisma/reseed.js ; else echo "applying migrations prod" && npx prisma generate && npx prisma migrate deploy ; fi

# # force reseeds for prod
# npx prisma db push --force-reset && node prisma/reseed.js

echo "starting server"
node server.js