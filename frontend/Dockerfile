# чтобы облегчить образ собираем в два этапа, builder означает что зависимости будут промежуточном этапом а затем будут очищаться. только 16 нода здесь.
FROM node:16-alpine as builder
WORKDIR /app
# *нужна для копирования не только package.json, но и package-lock.json для работы ci команды
COPY package*.json ./
# вместо i для сохранения версий зависимостей, --no-audit чтобы убрать проверку зависимостей на уязвимости, --no-fund не проверяем есть ли у пакета оплата
RUN npm ci --no-audit --no-fund
# кеширование
COPY . .
RUN npm run build

FROM nginx:latest as runner
WORKDIR /app
# потому что файловая система nginx по умолчаю имеет этот пуь с html-заглушкой.
COPY --from=builder /app/build /usr/share/nginx/html
# перезаписываем конфиг nginx на кастомный чтобы при f5 не выбрасывало ошибку
COPY ./nginx/default.conf /etc/nginx/conf.d
# EXPOSE 8081
# -g daemon off; для запуска в режиме daemon (форграунд режим)
ENTRYPOINT ["nginx", "-g", "daemon off;"]