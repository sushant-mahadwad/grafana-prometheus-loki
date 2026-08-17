# Use Node LTS
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy app code
COPY . .

# Expose your app port
EXPOSE 8000

# Start the server
CMD ["node", "server.js"]