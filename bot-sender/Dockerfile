FROM node:22-alpine

WORKDIR /app
COPY package.json server.mjs ./

ENV NODE_ENV=production
ENV PORT=3001

USER node
EXPOSE 3001
CMD ["node", "server.mjs"]
