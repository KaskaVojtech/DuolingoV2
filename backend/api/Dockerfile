FROM node:22-alpine
WORKDIR /app

# Dependencies
COPY package.json package-lock.json* ./
RUN npm install --production=false 

# Copy app
COPY prisma ./prisma
COPY src ./src

# Generate Prisma
RUN npx prisma generate

#USER node

CMD ["npm", "run", "start"]