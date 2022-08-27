FROM node:gallium-slim

WORKDIR /app
COPY . /app
RUN npm i -g @nestjs/cli
USER node