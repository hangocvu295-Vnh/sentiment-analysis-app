# Sử dụng Nginx làm server
FROM nginx:alpine

# Copy toàn bộ file web vào thư mục của Nginx
COPY . /usr/share/nginx/html

# Expose cổng 80
EXPOSE 80