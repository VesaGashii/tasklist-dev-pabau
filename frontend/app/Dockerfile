# Use the latest Node.js LTS version instead of 'latest' for stability
FROM node:lts

# Set the working directory inside the container
WORKDIR /app

# Copy only package.json and package-lock.json first to take advantage of Docker layer caching
COPY ./app/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY ./app ./


# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "run", "dev"]
