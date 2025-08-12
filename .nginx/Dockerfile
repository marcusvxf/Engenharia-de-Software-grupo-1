FROM nginx:1.27.5-alpine AS production

COPY nginx.conf /etc/nginx/nginx.conf
COPY mime.types /etc/nginx/mime.types
WORKDIR /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]