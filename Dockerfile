FROM node:8.1

COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm install --loglevel=warn

COPY . .
RUN npm run build

EXPOSE 3000

# Run npm start to start up the app
CMD [ "node", "server.js" ]
