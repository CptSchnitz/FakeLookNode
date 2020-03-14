FROM node:10

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 4000

CMD [ "node", "app.js" ]