# Sử dụng Node.js v20 nhẹ
FROM node:20-alpine

WORKDIR /app

# Copy package.json và cài đặt phụ thuộc
COPY package*.json ./
RUN npm install

# Copy toàn bộ mã nguồn frontend
COPY . .

# Mở cổng 3000 cho React
EXPOSE 3000

# Chạy ứng dụng
CMD ["npm", "start"]