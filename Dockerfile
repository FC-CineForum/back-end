FROM node:lts-alpine

WORKDIR /worker

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "node", "src/server/index.js" ]
