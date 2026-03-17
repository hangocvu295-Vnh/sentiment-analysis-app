# Sử dụng Node.js làm môi trường
FROM node:18-alpine

# Thư mục làm việc trong container
WORKDIR /app

# Copy package config
COPY package*.json ./
RUN npm install

# Copy toàn bộ mã nguồn
COPY . .

# Expose cổng 3000
EXPOSE 3000

# Chạy server
CMD ["npm", "start"]