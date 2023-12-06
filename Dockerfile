FROM node:18.16.0-alpine

WORKDIR /app

COPY .next/standalone ./
COPY .next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]