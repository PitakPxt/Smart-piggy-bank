# 🚀 โปรเจค React + Vite

## 📋 รายละเอียดโปรเจค

โปรเจคนี้เป็นเทมเพลตสำหรับการพัฒนาเว็บแอปพลิเคชันโดยใช้ React ร่วมกับ Vite ซึ่งเป็น build tool ที่มีประสิทธิภาพสูง พร้อมการตั้งค่าระบบ Hot Module Replacement (HMR) และการตรวจสอบคุณภาพโค้ดด้วย ESLint

## ✨ คุณสมบัติหลัก

- ⚡️ **Vite** - Build tool ที่เร็วที่สุดสำหรับ frontend
- ⚛️ **React 18** - JavaScript library สำหรับสร้าง user interfaces
- 📦 **Hot Module Replacement (HMR)** - อัพเดทโค้ดแบบ real-time
- 🔍 **ESLint** - ตรวจสอบและรักษาคุณภาพโค้ด
- 🎨 **CSS Modules** - จัดการ CSS แบบ scoped
- 📱 **Responsive Design** - รองรับทุกขนาดหน้าจอ

## 💻 ความต้องการของระบบ

- Bun เวอร์ชัน 1.0.0 หรือใหม่กว่า
- เว็บบราวเซอร์ที่รองรับ ES2015+

## 🔧 การติดตั้ง

### 1. ติดตั้ง Bun Runtime

```bash
curl -fsSL https://bun.sh/install | bash
```

### 2. แตกไฟล์ Source Code

1. แตกไฟล์ ZIP ที่ได้รับมาไว้ในโฟลเดอร์ที่ต้องการ
2. เปิด Terminal หรือ Command Prompt
3. เข้าไปยังโฟลเดอร์ที่แตกไฟล์ไว้

```bash
cd path/to/extracted/folder
```

### 3. ติดตั้ง Dependencies

```bash
bun install
```

### 4. รันโปรเจคในโหมดพัฒนา

```bash
bun dev
```

### 5. สร้างไฟล์สำหรับ Production

```bash
bun run build
```

## 🚀 คำสั่งที่ใช้บ่อย

```bash
# รันในโหมดพัฒนา
bun dev

# สร้างไฟล์สำหรับ Production
bun run build

# ทดสอบระบบ
bun test

# ตรวจสอบ code style
bun run lint
```

## 📝 หมายเหตุ

- ตรวจสอบให้แน่ใจว่าได้ติดตั้ง Bun ในเครื่องก่อนเริ่มพัฒนา
- หากพบปัญหาในการติดตั้ง Dependencies ให้ลบโฟลเดอร์ node_modules และ bun.lockb แล้วรัน `bun install` ใหม่
- สำหรับการ deploy ควรใช้คำสั่ง `bun run build` เพื่อสร้างไฟล์ optimized สำหรับ production
