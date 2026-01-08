# Use Node.js 18 slim as base image
FROM node:18-slim

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the backend code
COPY . .

# Expose the port the app runs on
EXPOSE 8080

# Environment variable for port (Cloud Run sets this automatically)
ENV PORT 8080

# Command to start the application
CMD ["npm", "start"]
