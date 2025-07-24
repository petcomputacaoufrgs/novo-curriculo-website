# Etapa 1: build do projeto com Node
FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa 2: servir os arquivos estáticos com NGINX
FROM nginx:stable-alpine

# Remove conteúdo padrão do nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia o build da etapa anterior
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
