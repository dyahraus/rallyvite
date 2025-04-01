# client/Dockerfile
FROM node:18

# Set the working directory for the client service
WORKDIR /usr/src/app

# Copy package.json and package-lock.json and install dependencies
COPY ./package*.json ./
RUN npm install

# Copy the client app code
COPY . ./

# Build the client app (e.g., React, Next.js, etc.)
# RUN npm run dev

# Expose the port for the client service (adjust if different)
EXPOSE 3000

# Command to start the client service (use npm start for React, Next.js, etc.)
CMD ["npm", "run","dev"]
