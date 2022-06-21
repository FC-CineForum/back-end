FROM node:12

WORKDIR /worker

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT 3000

EXPOSE $PORT

CMD [ "node", "src/server/index.js" ]
