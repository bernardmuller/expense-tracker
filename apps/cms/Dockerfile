FROM node:22-alpine
RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev nasm bash vips-dev git
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /opt/app
COPY package.json package-lock.json ./
RUN npm install -g node-gyp
RUN chown -R node:node /opt/app
USER node
RUN npm config set fetch-retry-maxtimeout 600000 && npm install
COPY --chown=node:node . .
RUN npm run build

EXPOSE 1337
CMD ["npm", "run", "start"]
