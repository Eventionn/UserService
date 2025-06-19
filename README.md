

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

- Add the secret for Password Reset Email

Criar secret:
kubectl create secret generic email-secret --from-literal=EMAIL_USER=example@mail.com --from-literal="EMAIL_PASS=password"

Habilitar secret no deployment:
kubectl set env deployment/userservice-deployment --from=secret/email-secret

Restart do deployment:
kubectl rollout restart deployment/userservice-deployment  


## Tech & framework used
- [Docker](https://www.docker.com/), an open platform for developing, shipping, and running applications
- [Prisma](https://www.prisma.io/), a new kind of ORM for Node.js and Typescript
- [Express](https://expressjs.com/) a fast unopinionated, minimalist web framework for Node.js
- [PostgreSQL](https://www.postgresql.org/), an open source relational database
