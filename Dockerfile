FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --no-fund --no-audit --no-dedupe --legacy-peer-deps

COPY . .

RUN npx hardhat compile

CMD ["npx", "hardhat", "node"]
