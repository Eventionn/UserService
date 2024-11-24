

- Build, fetch and run docker containers
```
docker-compose up -d
```

- Generate Migrations
```
npx prisma generate
```

- Generate Seed
```
node prisma/seed.js
```

- Generate Pods Metrics
Habilitar o Metrics Server para coletar métricas:
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml






## Tech & framework used
- [Docker](https://www.docker.com/), an open platform for developing, shipping, and running applications
- [Prisma](https://www.prisma.io/), a new kind of ORM for Node.js and Typescript
- [Express](https://expressjs.com/) a fast unopinionated, minimalist web framework for Node.js
- [PostgreSQL](https://www.postgresql.org/), an open source relational database
