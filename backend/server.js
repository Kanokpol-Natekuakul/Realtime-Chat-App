require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const http = require('http');
const { Server } = require('socket.io');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(express.json());
app.use(cors());

// 📌 เชื่อมต่อ MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) console.error('❌ MySQL Error:', err);
  else console.log('✅ Connected to MySQL');
});

// 📌 สมัครสมาชิก
app.post('/register', async (req, res) => {
  const { username, password, email } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  db.query(
    'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
    [username, hashedPassword, email],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: '✅ Registered successfully!' });
    }
  );
});

// 📌 เข้าสู่ระบบ
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (err || results.length === 0) return res.status(401).json({ error: '❌ User not found' });
    const user = results[0];
    if (!(await bcrypt.compare(password, user.password))) 
      return res.status(401).json({ error: '❌ Invalid password' });
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  });
});

// 📌 ดึงข้อความแชท
app.get('/chats/:user1/:user2', (req, res) => {
  const { user1, user2 } = req.params;
  db.query(
    'SELECT * FROM chats WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) ORDER BY sent_at',
    [user1, user2, user2, user1],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

// 📌 ตั้งค่า WebSocket (Socket.io)
io.on('connection', socket => {
  console.log('⚡ A user connected:', socket.id);
  
  socket.on('sendMessage', ({ sender_id, receiver_id, message }) => {
    const query = 'INSERT INTO chats (sender_id, receiver_id, message) VALUES (?, ?, ?)';
    db.query(query, [sender_id, receiver_id, message], err => {
      if (err) console.error(err);
      else io.emit('newMessage', { sender_id, receiver_id, message });
    });
  });

  socket.on('disconnect', () => console.log('🔴 User disconnected:', socket.id));
});

server.listen(3000, () => console.log('🚀 Server running on port 3000'));
