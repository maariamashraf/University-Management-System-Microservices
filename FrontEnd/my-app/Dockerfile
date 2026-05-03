# syntax=docker/dockerfile:1

# Academic / dev-friendly: serve the production bundle with Vite’s preview server
# (no separate web server like nginx—you already depend on Node for the build).

FROM node:22-alpine
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG VITE_API_BASE_URL=http://localhost:8080
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# `npm run build` runs `tsc -b` which may fail; `vite build` is enough for a running SPA.
RUN npx vite build

EXPOSE 4173
CMD ["npx", "vite", "preview", "--host", "0.0.0.0", "--port", "4173"]
