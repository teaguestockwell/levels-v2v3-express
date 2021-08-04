export DATABASE_URL="postgresql://${PG_USER}:${APP_DB_ADMIN_PASSWORD}@${PGHOST}:${PGPORT}"
export PORT="${PORT:-8080}"
# echo $DATABASE_URL

echo "waiting for DB to accept conenctions: 5" && node -e "(() => {setTimeout(() => {return}, 1000)})()"
echo "waiting for DB to accept conenctions: 4" && node -e "(() => {setTimeout(() => {return}, 1000)})()"
echo "waiting for DB to accept conenctions: 3" && node -e "(() => {setTimeout(() => {return}, 1000)})()"
echo "waiting for DB to accept conenctions: 2" && node -e "(() => {setTimeout(() => {return}, 1000)})()"
echo "waiting for DB to accept conenctions: 1" && node -e "(() => {setTimeout(() => {return}, 1000)})()"

if [ "${IS_LOCAL}" = "true" ]; then echo "reseting db and reseeding" && npx prisma generate && npx prisma db push --force-reset && node prisma/reseed.js ; else echo "applying migrations prod" && npx prisma generate && npx prisma migrate deploy ; fi

# # force reseeds for prod
# npx prisma db push --force-reset && node prisma/reseed.js

echo "starting server"
node server.js