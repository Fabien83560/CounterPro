FROM node:22.6.0

WORKDIR /usr/src/app
COPY application/package*.json ./
RUN npm install
COPY application/ .

RUN ls -l /usr/src/app

CMD [ "node", "main.js" ]
