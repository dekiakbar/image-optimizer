FROM node:gallium-slim

WORKDIR /app
ADD ./ /app
RUN npm i -g @nestjs/cli
USER node