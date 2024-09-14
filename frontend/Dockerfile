FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm i
# RUN npm ci --no-audit --no-fund
# кеширование
COPY . .
# RUN npm run install
ENTRYPOINT ["npm", "run", "start"]