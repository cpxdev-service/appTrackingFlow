FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm i

# คัดลอกโค้ดทั้งหมดไปยัง container
COPY . .
RUN rm -rf clientapp/node_modules

# สร้าง environment variable สำหรับ port (default 3000)
ENV PORT=8080

# เปิด port ที่ app จะรัน
EXPOSE $PORT

# คำสั่งรัน app (ใช้ node ตรงๆ หรือ pm2 ถ้าต้องการ process manager)
CMD ["npm", "start"]
