FROM node:lts
WORKDIR /creature-app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
ENV PORT=8002
EXPOSE 8002
CMD ["npm", "start"]