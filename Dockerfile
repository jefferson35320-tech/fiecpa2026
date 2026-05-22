# Estágio de Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Estágio de Execução
FROM node:20-alpine
WORKDIR /app

# Instalamos o pacote 'serve' globalmente para rodar o servidor estático
RUN npm install -g serve

# Copiamos apenas a pasta build do estágio anterior
COPY --from=builder /app/build ./build

# Expõe a porta 3000 (padrão do serve)
EXPOSE 3000

# Comando para rodar o servidor
# -s: Garante que rotas do React Router funcionem (Single Page App)
# -l 3000: Define a porta
CMD ["serve", "-s", "build", "-l", "3000"]
