# Stage 1: Build the Next.js application
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json yarn.lock* ./

# Install dependencies using yarn
RUN yarn install --frozen-lockfile

# Copy application files
COPY . .

# Build application
RUN yarn build

# Stage 2: Create production image
FROM node:20-alpine AS runner

# Set working directory
WORKDIR /app

# Create a non-root user to run the application
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy necessary files from build stage
COPY --from=build --chown=nextjs:nodejs /app/next.config.js ./
COPY --from=build --chown=nextjs:nodejs /app/public ./public
COPY --from=build --chown=nextjs:nodejs /app/.next ./.next
COPY --from=build --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=build --chown=nextjs:nodejs /app/yarn.lock ./yarn.lock
COPY --from=build --chown=nextjs:nodejs /app/node_modules ./node_modules

# Set environment variables
ENV NODE_ENV production
ENV PORT 3000

# Expose the port the app will run on
EXPOSE 3000

# Switch to non-root user
USER nextjs

# Start the application
CMD ["yarn", "start"]
