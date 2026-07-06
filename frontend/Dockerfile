# ---- Next.js production image ----
FROM node:20-alpine
WORKDIR /app

# Install dependencies first for better layer caching.
COPY package.json ./
RUN npm install

# Copy the rest of the app (including .env.local, which sets NEXT_PUBLIC_API_URL).
COPY . .

# NEXT_PUBLIC_* vars are inlined into the client bundle at build time.
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start"]
