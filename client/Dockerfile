FROM node:16-alpine

WORKDIR /app

COPY package.json .
RUN npm i --only=prod
COPY . .

CMD ["npm", "run", "dev"]