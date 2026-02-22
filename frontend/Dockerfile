FROM node:20-alpine
WORKDIR /src
COPY package.json package-lock.json ./
RUN npm install
COPY . .
EXPOSE 5173
# This runs the React dev server
CMD ["npm", "run", "dev", "--", "--host"]
