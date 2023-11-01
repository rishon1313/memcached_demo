# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy all application code to the working directory
COPY . .

# Expose a port for the application to listen on (modify as needed)
EXPOSE 3000

# Define the command to start your Node.js application
CMD [ "node", "server.js" ]