# чтобы облегчить образ собираем в два этапа, builder означает что зависимости будут промежуточном этапом а затем будут очищаться
FROM node:18-alpine as builder
WORKDIR /app
# *нужна для копирования не только package.json, но и package-lock.json для работы ci команды, ./ -копируем  в корень
COPY package*.json ./
# вместо i для сохранения версий зависимостей, --no-audit чтобы убрать проверку зависимостей на уязвимости, --no-fund не проверяем есть ли у пакета оплата
RUN npm ci --no-audit --no-fund
# кеширование
COPY . .
RUN npm run build

FROM node:18-alpine as runner
WORKDIR /app
COPY package*.json ./
# --omit=dev чтобы не копировать dev зависимости, \ чтобы не создаватьь лишний слой
RUN npm ci --omit=dev --no-audit --no-fund \
  && npm i -g pm2
# так как в предыдущем этапе собрали зависимости в builder, то копируем из него из app/dist в dist (мы уже в app workdir)
COPY --from=builder /app/dist ./dist
COPY ./ecosystem.config.js ./
# -runtime запуск в форграунд режиме
CMD ["pm2-runtime", "start", "ecosystem.config.js"]