# Step 1: Build React App
FROM harbor.davrbank.uz/hub.docker.com/node:latest AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm config set registry https://nexus.davrbank.uz/repository/npm-proxy/
RUN npm install -f
COPY . .
RUN npm run build

# Step 2: Serve with Nginx
FROM harbor.davrbank.uz/hub.docker.com/nginx:latest
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]
