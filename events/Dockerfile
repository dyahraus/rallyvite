# events/Dockerfile
FROM node:16

# Set the working directory for the events service
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY ./package*.json ./
RUN npm install

# Copy the events service code
COPY . ./

# Expose the port for the events service
EXPOSE 5000

# Command to run the events service
CMD ["npm", "start"]
