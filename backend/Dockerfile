FROM node:latest

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app
RUN npm install -g npm@8.5.0 && npm update -S && npm install

# Bundle app source
COPY . /usr/src/app

EXPOSE 3000

CMD [ "npm", "start" ]
