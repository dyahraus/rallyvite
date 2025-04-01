# auth-service/Dockerfile
FROM node:18

# Set the working directory for the client service
WORKDIR /usr/src/app

# Copy package.json and package-lock.json and install dependencies
COPY ./package*.json ./
RUN npm install

# Copy the client app code
COPY . ./

# Expose the port the auth service will run on
EXPOSE 3001

# # Command to run the auth service
CMD ["npm", "start"]
