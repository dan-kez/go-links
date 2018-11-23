FROM node:10

WORKDIR /app
COPY ./package.json ./yarn.lock ./tsconfig.json ./
RUN yarn

COPY ./ ./

ENV DEBUG=golinks*
ENV NODE_CONFIG_ENV=production
ENV NODE_APP_INSTANCE=docker

EXPOSE 3001
CMD [ "yarn",  "ts-node", "-T", "src/index.ts" ]


