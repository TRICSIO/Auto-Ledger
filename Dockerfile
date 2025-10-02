# Dockerfile for Next.js application

# 1. Installer Stage: Install dependencies
FROM node:20-alpine AS installer
WORKDIR /app

COPY package.json ./
RUN npm install

# 2. Builder Stage: Build the application
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=installer /app/node_modules ./node_modules
COPY . .

# Environment variables for Genkit/AI features
# In a real self-hosted environment, these should be managed securely.
ENV GENKIT_ENV=production
# The user would need to provide their own Gemini API key here
ENV GEMINI_API_KEY=YOUR_API_KEY_HERE

RUN npm run build

# 3. Runner Stage: Create the final production image
FROM node:20-alpine AS runner
WORKDIR /app

# Set environment to production
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# The default port for Next.js is 3000
EXPOSE 3000

# The default user for node:20-alpine is 'node'
# We don't need to create one, but good practice to use it.
# However, for simplicity and to avoid permission issues with next's output files,
# we'll stick with the default user for now. A more hardened image would use a non-root user.

# Start the server
CMD ["node", "server.js"]
