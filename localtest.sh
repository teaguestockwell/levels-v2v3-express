docker stop database
docker rm database
docker run --rm --name database -e POSTGRES_PASSWORD=password -d -p 5432:5432 postgres
sleep 5
npm run create-tables-for-prisma-models
npm run seed
npm run test