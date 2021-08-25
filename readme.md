[![LinkedIn][linkedin-shield]][linkedin-url]

[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/teague-stockwell/

<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://levels.apps.dso.mil">
    <img src="https://user-images.githubusercontent.com/71202372/130336902-ea02b839-e153-494a-8234-f3a1f18f9775.png" alt="Logo" width="100%" >
  </a>

  <h1 align="center">Levels</h3>

  <p align="center">
    Aircraft cargo loading and weight and balance for the US Air Force
    <br />
    <a href="https://levels.apps.dso.mil">View live</a>
    ·
    <a href="https://forms.gle/Bbqvubn6gwC6fRnc8">Report Bug</a>
  </p>
</p>

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#overview">About</a></li>
    <ul>
      <li><a href="#overview">Overview</a></li>
       <li><a href="#about-the-ui">UI</a></li>
       <li><a href="#about-the-api">API</a></li>
       <li><a href="#system-architecture">System Architecture</a></li>
    </ul>
    <li><a href="#ui-built-with">Built With</a></li>
    <ul>
       <li><a href="#ui-built-with">UI</a></li>
       <li><a href="#api-built-with">API</a></li>
    </ul>
    <li><a href="#platform-one">DevSecOps</a></li>
    <ul>
      <li><a href="#platform-one">Platform One</a></li>
       <li><a href="#pipelines">Pipelines</a></li>
      <li><a href="#certificate-to-field">Certificate to Field</a></li>
       <li><a href="#auth-devsecops">Auth</a></li>
       <li><a href="#ui-devsecops">UI</a></li>
       <li><a href="#api-devsecops">API</a></li>
       <li><a href="#db-devsecops">DB</a></li>
    </ul>
    <li><a href="#prerequisites">Getting Started</a></li>
    <ul>
      <li><a href="#prerequisites">Prerequisites</a></li>
       <li><a href="#compose-prod">Compose Prod</a></li>
       <li><a href="#compose-dev">Compose Dev</a></li>
       <li><a href="#ui-testing">UI Testing</a></li>
       <li><a href="#api-testing">API Testing</a></li>
    </ul>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

# About
## Overview
Levels is a full stack web app that manages aircraft cargo loading and weight and balance for the US Air Force's load masters and maintenance. 

The first and second iterations were built with tech stacks that could not be accredited and deployed to the Air Force network:

1. [5 Level](https://github.com/tsAppDevelopment/levels-v1-android) Native Android
2. [Five Level](https://github.com/tsAppDevelopment/levels-v2-flutter) Flutter
3. Levels - [UI Repo](https://github.com/tsAppDevelopment/levels-v3-react) and [API Repo](https://github.com/tsAppDevelopment/levels-v2v3-express) 

Levels, the third iteration, is deployed and accredited under the Department of Defense's DevSecOps initiative: [Platform One](https://software.af.mil/about/) 

<p align="center">
  <img src="https://user-images.githubusercontent.com/71202372/130342917-e677cd03-b623-4fe7-bc8b-4ac04b3b4634.gif" />
</p>

## About the UI
The frontend service has two main components. The dashboard and the admin portal.

### Dashboard
The dashboard is used for configuring a cargo load to perform aircraft weight and balance.

### Admin Portal
The admin portal is used for performing CRUD operations on users, aircraft, configurations, and cargo.

### UI Features
- Offline persistance of the dashboard
- Near real time sync between the dashboard and the server while updating offline cache
- Real time admin portal
## About the API
The API is a Restful interface that manages CRUD operations against multiple aircraft and user roles.

### API Features
- JWT based user roles for each aircraft
- Local memory cache of common routes
- Logging
## System Architecture
The UI and API are deployed to Platform One's mission bootstrap cluster. It lives behind an ISTO auth service that can use 2FA or a smart card.

<p align="center">
  <img src="https://user-images.githubusercontent.com/71202372/130340674-03769459-1c01-4387-acdc-b607599e9700.png" alt="system architecture" width="100%" >
</p>

# Built With
## UI Built With
- [TypeScript](https://www.typescriptlang.org/)
- [Create React App](https://github.com/facebook/create-react-app)
- [Zustand](https://github.com/pmndrs/zustand)
- [Ant Design](https://github.com/ant-design/ant-design)
## API Built With
- [Postgres](https://github.com/postgres/postgres)
- [Express](https://expressjs.com/)
- [Prisma](https://www.prisma.io/)
- [TypeScript](https://www.typescriptlang.org/)

# DevSecOps
## Platform One
P1 is the Department of Defence DevSecOps initiative to deploy and accredit cloud native apps. [Read more.](https://software.af.mil/team/platformone/) 
## Pipelines
Pipelines are initially built in conjunction with the app team, and later managed by the DevSecOps team. Levels has separate pipelines for the frontend and backend service [located here](https://code.il2.dso.mil/platform-one/devops/pipeline-products/-/tree/five-level-app/products/tron/products/five-level-app). They each use GitLab yml files to configure how each pipeline is run.

Each service's pipeline stages must pass before a production release can be made. This is a high level overview of each stage. 

<p align="center">
  <img src="https://user-images.githubusercontent.com/71202372/130366086-51449b6e-1c29-4b5b-b488-9b4fd5bcf618.png" width="100%"/>
</p>

More info about each stage can be found [here](https://confluence.il2.dso.mil/display/P1PARTYBUS/HowTo+-+GitLab+-+Pipeline+Basics?src=contextnavpagetreemode). Also, it may be helpful to enroll in the ["Party Bus"](https://docs.google.com/forms/d/e/1FAIpQLScdVm3uZo_8PAt2aGivbj621DU02RROGGr8DsVb0QgRNLiDLw/viewform) to get more information about the stages and how they tie into accreditation.

## Certificate to Field
Platform One standardizes certificate to field under the following conditions:

- Services are containerized using hardened images from the Iron Banks registry
- Unit tests are written with 80% line coverage
- XP development
- Usage of Platform One's ISTO Auth service
- Adhering to security standards under SD Elements, Fortify, Sonarqube, and limiting [CVEs](https://cve.mitre.org)
- Passing pipelines

The current certificate to field (CtF) must be renewed once a year beginning June 24 2022, or when a new system architecture is created.

The certificate to field is only good for 1 major version of the application: 1.0.0 though 2.0.0. Minor and patch releases can be made to avoid re certification: 1.0.1 or 1.1.0
## Auth DevSecOps
All requests behind P1's auth service have a base64 encoded JWT with general information about a user. For more info see the API's test utils file.

## UI DevSecOps
## API DevSecOps
The API's Dockerfile accepts the argument IS_LOCAL. When IS_LOCAL is true, the API will reset the database and reseed the data. This is why the local E2E compose script starts with a fresh DB, and the staging and prod pipeline scripts persist the database.
## DB DevSecOps
Some cloud providers do not allow a shadow DB when Prisma pushes the schema into them. For more information see [the prisma docs](https://www.prisma.io/docs/guides/deployment/deployment) 

# Getting Started
## Prerequisites

1. [NodeJS](https://nodejs.org/en/download/)
2. [Docker](https://www.docker.com/get-started)
3. [Git](https://git-scm.com/downloads)
4. Recommended: login to hardened docker registry to run hardened images. There are minor differences between open source images and the hardened images. For example, the hardened images do not have sleep or mv
```sh
docker login registry.il2.dso.mil -u $gitlab_ci_token -p $gitlab_token_string
```
5. Clone the [UI](https://code.il2.dso.mil/tron/products/five-level-app/frontend-react) and [API](https://code.il2.dso.mil/tron/products/five-level-app/api) from GitLab, or [UI](https://github.com/tsAppDevelopment/levels-v3-react) and [API](https://github.com/tsAppDevelopment/levels-v2v3-express) from GitHub

6. Open the frontend repo

```sh
cd frontend-react
```
## Compose Prod
To compose the production app run these within the frontend-react repo. Use :os at the end of these commands if you have not logged on to the hardened registry.
1. Build the Production UI, DB, API, and Proxy images
```sh
docker:build:fullstack
```
2. Compose the services
```sh
docker:up:halfstack
```
## Compose Dev
While developing locally, you may like to use hot reload with React. To do this you can build the API and DB services under a Nginx proxy to develop the UI against them by running it locally. This attaches a mock user as a JWT for all requests to the API. Use :os at the end of these commands if you have not logged on to the hardened registry.
1. Build the API, DB, and Proxy services
```sh
docker:build:halfstack
```
2. Compose them
```sh
docker:up:halfstack
```
3. Install dependencies
```sh
npm i
```
4. Start the React development server
```sh
PORT=8080 react-scripts start
```
### UI Testing
Tests are run with [Jest,](https://jestjs.io/) [React Testing Library,](https://testing-library.com/docs/react-testing-library/intro/) and [Cypress](https://www.cypress.io/).

```sh
npx react-scripts test --coverage --watchAll=false
```

To run the E2E tests, run the following within the frontend-react repo. Use :os if you have not logged on to the hardened img registry.

1. Build the production docker images
```sh
npm run docker:build:fullstack
```
2. Compose the production containers
```sh
npm run docker:up:fullstack
```
3. Install Cypress
```sh
npm i
```
4. Run the E2E tests
```sh
npm run E2E
```
### API Testing
Tests are run as integrations tests inside of a Postgresql service and a node service. Between each test the database may need to be reset and reseeded. See `aircraft.test` for an example.

The test utils contains mocks of different user roles that can be passed to the auth header in [Supertest](https://www.npmjs.com/package/supertest).

Use :os at the end of these commands if you have not logged on to the hardened registry.
1. Build the API and run a container with the test script against an instance of Postgresql 
```sh
npm run docker:test
```

# Roadmap
See [Mattermost,](https://chat.il2.dso.mil/tron-air-force/channels/5-level---internal) [Jira,](https://jira.il2.dso.mil/secure/RapidBoard.jspa?rapidView=578&projectKey=FIVE&selectedIssue=FIVE-101) and [Figma](https://www.figma.com/file/JZxOMMwYQE8tySwGYiHeqw/Levels?node-id=0%3A1) for the latest proposed features.

Report a [bug](https://forms.gle/Bbqvubn6gwC6fRnc8)
# Contributing
1. Open an issue to talk about the feature or bug fix
2. Fork the repository
3. Clone the repository
4. Implement feature with 80% line coverage
5. Submit a merge request
# License
See `licence` for more information.
# Contact
Teague Stockwell - matermost (@teaguezs) [LinkedIn](https://www.linkedin.com/in/teague-stockwell)
# Acknowledgements
- [Platform One](https://software.af.mil/team/platformone/) for deployment and devSecOps
- [Brandon Swenson](https://github.com/bmswens) for helping containerize with hardened images
