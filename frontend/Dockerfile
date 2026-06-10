# Usa a mesma versão do Node.js do back-end
FROM node:20-alpine

# Define a pasta de trabalho dentro do contêiner
WORKDIR /app

# Copia os arquivos de dependências para instalar primeiro
COPY package*.json ./
RUN npm install

# Copia o resto dos arquivos do front-end para dentro do Docker
COPY . .

# Avisa ao Docker que o Vite roda na porta 5173 por padrão
EXPOSE 5173

# Comando para ligar o servidor de desenvolvimento do Vite
CMD ["npm", "run", "dev", "--", "--host"]
