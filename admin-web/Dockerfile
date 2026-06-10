FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# 构建项目
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main.js"]