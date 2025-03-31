# auth/Dockerfile
FROM node:16

# Set the working directory for the auth service
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY ./package*.json ./
# RUN npm install

# Copy the auth service code
COPY . ./

# Expose the port the auth service will run on
EXPOSE 3001

# # Command to run the auth service
# CMD ["npm", "start"]
