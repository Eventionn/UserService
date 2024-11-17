FROM node:23-alpine

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
COPY . . 

RUN npx prisma generate
RUN npx prisma migrate deploy

EXPOSE 5001

CMD [ "npm", "run", "dev" ]