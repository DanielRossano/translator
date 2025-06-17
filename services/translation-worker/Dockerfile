# Use Node.js LTS Alpine image for smaller size and better security
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY services/translation-worker/package*.json ./

# Install dependencies
RUN npm install --omit=dev && npm cache clean --force

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copy application source code
COPY services/translation-worker/src ./src

# Create credentials directory (for future use if needed)
RUN mkdir -p /app/credentials && chown -R nextjs:nodejs /app/credentials

# Change ownership of app directory
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Start the application
CMD ["npm", "start"] 