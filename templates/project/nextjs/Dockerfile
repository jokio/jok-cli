FROM node:9

# Create app directory
WORKDIR /usr/src/app

# Install packages
COPY package*.json ./
RUN npm i

# Build the source code
COPY . .
RUN npm -v
RUN npm run build

# Start the app
EXPOSE 3000
CMD [ "npm", "start" ]
