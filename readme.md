###To compose locally
Use the fullstack template by pointing it's .env to the front and backend docker files, then run bin/run.sh || bin/run.cmd

What the heck is a fullstack template and why are we using it? BSwenson made a tool that mock the P1 env locally by injecting an auth header. This allows us to create roles and profiles for users authenticated with P1's Keycloak: https://code.il2.dso.mil/brandon.swenson/fullstack-template

###TODO:
Named route for /aircraft?id
