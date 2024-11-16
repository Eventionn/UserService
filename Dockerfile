FROM node:23-alpine

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
COPY . . 
EXPOSE 5001

RUN npx prisma generate
CMD [ "npm", "run", "dev" ]