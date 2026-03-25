FROM node:18-alpine AS base
RUN apk add --no-cache libc6-compat && \
  apk add --no-cache bash && \
  apk update && \
  npm install pm2 -g

FROM base AS pruner
WORKDIR /app
COPY *.json ./
COPY .eslintrc.js ./.eslintrc.js
COPY .npmrc ./.npmrc
COPY .nvmrc ./.nvmrc
COPY src/mixer/packages ./src/mixer/packages
COPY src/mixer/web ./src/mixer/web
COPY src/mixer/public ./src/mixer/public
RUN npm i -g turbo && \
  npm i --package-lock-only && \
  npm run prune:web

FROM base AS builder
WORKDIR /app
#install
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/package-lock.json ./package-lock.json
RUN npm ci
# build
COPY --from=pruner /app/out/full/ .
RUN npm run build:web

FROM base as runtime
WORKDIR /app
COPY wait-for-it.sh .
RUN chmod u+x ./*.sh
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src/mixer/web/.next/standalone/src/mixer/web ./
COPY --from=builder /app/src/mixer/web/.next/static ./.next/static
COPY --from=pruner /app/src/mixer/public ./public
ENV NODE_ENV=production
EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"
CMD ["pm2-runtime", "server.js"]
