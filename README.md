/realtime-chat-app
│── /backend       # ฝั่งเซิร์ฟเวอร์ (Node.js + Express + MySQL)
│   │── server.js  # ไฟล์หลักของ Backend
│   │── .env       # เก็บค่าตัวแปรแวดล้อม เช่น พอร์ต ฐานข้อมูล
│   │── package.json # เก็บแพ็คเกจที่ใช้ใน Backend
│   └── /db        # ไฟล์ที่ใช้สร้างฐานข้อมูล
│       └── init.sql
│
└── /frontend      # ฝั่งหน้าเว็บ (React + Tailwind + Socket.io Client)
    │── /src
    │   │── App.js  # ไฟล์หลักของ Frontend
    │   │── index.js # ไฟล์เริ่มต้นของ React
    │   └── styles.css
    │── package.json
    └── public
        └── index.html
