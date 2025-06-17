# Use Node.js LTS Alpine image for smaller size and better security
FROM node:18-alpine

# Install wget for healthcheck
RUN apk add --no-cache wget

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY services/translation-api/package*.json ./

# Install dependencies
RUN npm install --omit=dev && npm cache clean --force

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copy application source code
COPY services/translation-api/src ./src

# Create credentials directory (for future use if needed)
RUN mkdir -p /app/credentials && chown -R nextjs:nodejs /app/credentials

# Change ownership of app directory
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Add health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Start the application
CMD ["npm", "start"] 