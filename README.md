# NzBill - Visual Novel Bill Manager 💰🎮

> แอปจัดการบิลและค่าใช้จ่ายสไตล์ Visual Novel ที่มี "น้องเมย์" เป็นผู้ช่วยส่วนตัว

---

## 📖 เกี่ยวกับโปรเจค

**NzBill** เป็นเว็บแอปพลิเคชันที่ช่วยจัดการบิลและติดตามค่าใช้จ่ายประจำเดือน โดยมีจุดเด่นคือการนำเสนอในรูปแบบ **Visual Novel** ที่มีตัวละครอนิเมะ "น้องเมย์" คอยช่วยเหลือและให้คำแนะนำด้านการเงิน ทำให้การจัดการเงินไม่น่าเบื่ออีกต่อไป!

### 🎯 เป้าหมายหลัก
- ทำให้การจัดการบิลสนุกและมีส่วนร่วม (Gamification)
- ลดความเครียดในการจัดการการเงินด้วย UI ที่น่ารัก
- เหมาะสำหรับผู้ใช้ที่ชอบเกมส์และอนิเมะ

---

## 🎨 สไตล์การออกแบบ

### Visual Novel UI
- **Overlay-based Layout**: ทุก element (เมนู, panels) ลอยอยู่บนตัวละครและฉากหลัง
- **ตัวละคร "น้องเมย์"**: ปรากฏตลอดเวลา พร้อม expressions ต่างๆ (idle, happy, worried, thinking)
- **Speech Bubble**: กล่องข้อความแบบ Visual Novel พร้อม typing effect
- **Game-style Navigation**: เมนูด้านล่างสไตล์เกมส์มือถือ

### สีหลัก
- **Primary**: `#E8734A` (ส้ม-แดง)
- **Background**: Cream/Pastel tones
- **Character Colors**: สีอ่อนหวานสไตล์อนิเมะ

---

## ✨ ฟีเจอร์หลัก

### 1. 📋 จัดการบิล (Bill Management)
- เพิ่ม/แก้ไข/ลบบิล
- กำหนดวันครบกำหนด (Due Date)
- แบ่งหมวดหมู่ (ค่าน้ำ, ค่าไฟ, บัตรเครดิต, ฯลฯ)
- ตั้งเตือนล่วงหน้า (Reminder Days)
- บิลประจำ (Recurring Bills)

### 2. 💹 สรุปการเงิน (Financial Summary)
- Total Cash (เงินคงเหลือ)
- Total Debt (หนี้ทั้งหมด)
- Daily Budget (ใช้ได้ต่อวัน)
- Financial Health Status

### 3. 🎭 ตัวละคร (Character System)
- **Expressions**: idle, happy, worried, excited, thinking
- **Animations**: หายใจ, พูด, กระพริบตา
- **Interactive**: คลิกเพื่อโต้ตอบ

### 4. 💬 ระบบบทสนทนา (Dialog System)
- บทสนทนาตอบสนองตามเวลา (เช้า/บ่าย/เย็น/ดึก)
- คำแนะนำการเงินอัตโนมัติ
- Typing Effect แบบ Visual Novel

### 5. ⚙️ ตั้งค่า (Settings)
- เปิด/ปิดเสียง
- การตั้งค่าการแจ้งเตือน
- ข้อมูลการเงิน

---

## 🛠️ เทคโนโลยีที่ใช้

| ประเภท | เทคโนโลยี |
|--------|----------|
| Framework | React 18 + TypeScript |
| Build Tool | Vite |
| Styling | CSS (Custom Design System) |
| State | React Hooks + Local Storage |
| Lint | ESLint |

---

## 📁 โครงสร้างโปรเจค

```
src/
├── assets/
│   ├── backgrounds/     # ภาพพื้นหลัง
│   └── characters/      # ภาพตัวละคร (may_idle, may_happy, etc.)
├── components/
│   ├── Bills/           # BillCard, AddBillModal
│   ├── Character/       # Character, SpeechBubble
│   ├── Financial/       # FinancialSummary
│   └── Layout/          # Header, BottomNav
├── hooks/
│   ├── useBills.ts      # จัดการข้อมูลบิล
│   ├── useCharacterAnimation.ts  # Animation ตัวละคร
│   ├── useDialog.ts     # ระบบบทสนทนา
│   └── useLocalStorage.ts  # เก็บข้อมูลใน LocalStorage
├── data/
│   └── dialogues.ts     # บทสนทนาน้องเมย์
├── styles/
│   ├── index.css        # Design System (colors, typography, etc.)
│   └── animations.css   # CSS Animations
├── types/
│   └── index.ts         # TypeScript Types
├── App.tsx              # Main App Component
└── App.css              # App-level styles
```

---

## 🚀 วิธีรัน

```bash
# ติดตั้ง dependencies
npm install

# รัน Development Server
npm run dev

# Build สำหรับ Production
npm run build

# ตรวจสอบ Lint
npm run lint
```

---

## 📝 สิ่งที่พัฒนาต่อได้

### 🔔 Notification System (แนะนำ)
- Push Notifications สำหรับแจ้งเตือนบิลใกล้ถึง
- Line Notify หรือ Email

### 📱 PWA Support
- ติดตั้งบนมือถือได้
- Offline Support

### 🎤 Text-to-Speech
- เสียงพูดสำหรับน้องเมย์

### 💾 Cloud Sync
- Firebase หรือ Supabase สำหรับ sync ข้อมูลข้ามอุปกรณ์

### 🎮 Gamification
- Level System
- Experience Points
- Achievements

### 🖼️ ตัวละครเพิ่มเติม
- เปลี่ยนชุด (Outfits)
- ตัวละครใหม่

---

## 👩‍💻 สำหรับนักพัฒนา

### Design Principles
1. **Mobile-First**: ออกแบบสำหรับมือถือเป็นหลัก (max-width: 430px)
2. **Game-like Feel**: ทุก interaction ต้องรู้สึกเหมือนเล่นเกมส์
3. **Character Always Visible**: ตัวละครต้องมองเห็นได้ตลอดเวลา
4. **Soft & Warm Colors**: สีอ่อนหวาน ไม่แสบตา

### Coding Conventions
- ใช้ TypeScript สำหรับ type safety
- Custom Hooks สำหรับ logic ที่ reuse ได้
- CSS Variables สำหรับ Design System
- Component-based Architecture

---

## 📄 License

MIT License - ใช้งานได้อย่างอิสระ

---

## 🙏 Credits

- **ตัวละคร**: น้องเมย์ (AI Generated)
- **Design Inspiration**: Visual Novel Games
- **Developer**: NzDev Team

---

> **"ให้น้องเมย์ช่วยดูแลบิลของคุณนะคะ~"** 💕
