# Azdev Time Manager

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

It makes use of NextJS, Prisma, tRPC, Tailwind, Postgres and AzDev api to manage your hours for the selected iteration

## Getting Started

### Requirements before you can get started

* A postgres database available and connection string added to `.env` file with key `DATABASE_URL`
* An AzDev Personal Access Token with at least read access for work items added to `.env` with key `AZDEV_TOKEN`
* An AzDev Organisation URL added to `.env` with key `ORG_URL`

Install dependencies with

```bash
yarn install
```

Then, run migrations on your DB (assuming your connection string is setup in `.env`)

```bash
yarn prisma db push
```

Then, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

