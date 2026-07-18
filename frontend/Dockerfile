FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -S musichub && adduser -S musichub -G musichub
RUN npm install -g serve
COPY --from=build /app/dist ./dist
USER musichub
EXPOSE 4173
CMD ["serve", "-s", "dist", "-l", "4173"]
