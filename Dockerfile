FROM node:20
WORKDIR /usr/app
COPY package*.json .
RUN npm ci --legacy-peer-deps
COPY . .
RUN npm run build
EXPOSE 8000
CMD ["npm", "start"]