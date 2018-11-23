# Stage 1 - the build process
FROM node:9.10 as build-deps
WORKDIR /usr/src/app
COPY package.json yarn.lock tsconfig.json ./
RUN yarn
COPY ./public ./public
COPY ./src ./src
RUN yarn build
COPY ./public ./public

# Stage 2 - the production environment
FROM nginx:1.12-alpine
COPY --from=build-deps /usr/src/app/build /var/www/golinks
COPY nginx/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]