### To compose locally

Use the fullstack template by pointing it's .env to the front and backend docker files, then run bin/run.sh || bin/run.cmd

What the heck is a fullstack template and why are we using it? BSwenson made a tool that mock the P1 env locally by injecting an auth header. This allows us to create roles and profiles for users authenticated with P1's Keycloak: https://code.il2.dso.mil/brandon.swenson/fullstack-template

### Postgress img out of space on mac?

1. https://github.com/docker/for-mac/issues/371#issuecomment-248404423
2. reset docker to factory defaults
3. docker pull nginx && docker pull node:14.15.4 && docker pull nginx

### TODO?:

cascading updated && updatedBy for models?

logs for all routes? log: Datetime, email, role, req.route, req.method, req.body

route to view logs?: req.params ?from=datetime1&to=datetime2

in mem array of all aircraft in front of /aircraft with frequent db polling?

rm General.name from prisma/db then: /general => General.name = "First Last"

rm all but 1 General from prisma/ db && rm General.role then: /general => General.role = req.role

edited && editedBy for routes:

1. user - no cascade?
2. tank - cascade? aircraft
3. glossarys cascade? aircraft
4. config - cascade? aircraft
5. configcargo - cascade? config,aircraft
6. cargo - cascade? configcargo, aircraft, config
7. aircraft