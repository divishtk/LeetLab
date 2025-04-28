# Leet Lab
Basic description of your project.

## Installation

Instructions on how to get a copy of the project and running on your local machine.

### Prerequisites

_A guide on how to install the tools needed for running the project._

Explain the process step by step.

```bash
cd /Backend - npm install
```

## Usage

Explain how to test the project and give some example.

```bash
-> nodemon dev (backend)
-> npm start   (frontned)
```

## Docker Postgres Setup
 1) Install docker. 
 2) Search for postgres image, install it.
 3) Now using below command setup db.
```bash
# docker run --name my-PostgreLeetLab -e POSTGRES_USER=divisht -e POSTGRES_PASSWORD=qwerty -p 5432:5432 -d postgres;
```
  4) Start docker container using below command.
```bash
 docker start my-PostgreLeetLab
```
5) Once docker image and container is up , db with prisma orm is sync successfully.




## Primsa ORM Setup

1) Prep Prisma schema (Eg - User , Problems )
2) npx prisma generate
3) npx prisma migrate dev (Run migrations to sync the database & a new folder will be created migrations)




## Technologies

_Name the technologies used in the project._ 
* [Node](https://nodejs.org/en) - Backend Used.
* [React](https://reactjs.org/) - UI Library.
* [Prisma](https://www.prisma.io/) - ORM.
