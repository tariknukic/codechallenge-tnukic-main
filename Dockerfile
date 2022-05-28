# Don't change this file, unless you really know what you are doing.
FROM node:14-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
# Always keep this port.
EXPOSE 3000
CMD ["node", "src/app.js"]
