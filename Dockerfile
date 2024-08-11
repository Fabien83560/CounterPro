FROM node:22.6.0

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

RUN ls -l /usr/src/app

CMD [ "node", "main.js" ]
