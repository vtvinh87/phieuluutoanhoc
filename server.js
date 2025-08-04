const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const axios = require('axios');
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Kết nối SQLite
const db = new sqlite3.Database('game_data.db', (err) => {
  if (err) {
    console.error('Error connecting to SQLite:', err.message);
  } else {
    console.log('Connected to SQLite database.');
    // Tạo bảng nếu chưa tồn tại
    db.run(`CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      class INTEGER,
      island INTEGER,
      question TEXT,
      answer TEXT
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS progress (
      user_id TEXT,
      class INTEGER,
      island INTEGER,
      question_index INTEGER,
      PRIMARY KEY (user_id, class, island)
    )`);
  }
});

// Giả lập gọi Gemini API (thay bằng API thực của bạn)
async function fetchQuestionsFromGemini(classLevel, island) {
  try {
    // Thay thế bằng URL và API key thực của Gemini
    const response = await axios.get('https://api.gemini.example/questions', {
      params: { class: classLevel, num_questions: 5 }
    });
    return response.data.questions; // Giả sử trả về [{question: "...", answer: "..."}, ...]
  } catch (error) {
    console.error('Error fetching from Gemini:', error.message);
    return [];
  }
}

// API lấy câu hỏi
app.get('/questions/:class/:island', async (req, res) => {
  const { class: classLevel, island } = req.params;
  // Kiểm tra trong SQLite trước
  db.all(
    `SELECT * FROM questions WHERE class = ? AND island = ?`,
    [classLevel, island],
    async (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (rows.length > 0) {
        // Trả về câu hỏi từ SQLite nếu có
        return res.json(rows);
      }
      // Nếu không có, lấy từ Gemini
      const questions = await fetchQuestionsFromGemini(classLevel, island);
      if (questions.length === 0) {
        return res.status(500).json({ error: 'Cannot fetch questions' });
      }
      // Lưu câu hỏi vào SQLite
      questions.forEach(({ question, answer }) => {
        db.run(
          `INSERT INTO questions (class, island, question, answer) VALUES (?, ?, ?, ?)`,
          [classLevel, island, question, answer]
        );
      });
      res.json(questions);
    }
  );
});

// API lưu tiến độ
app.post('/progress', (req, res) => {
  const { user_id, class: classLevel, island, question_index } = req.body;
  db.run(
    `INSERT OR REPLACE INTO progress (user_id, class, island, question_index) VALUES (?, ?, ?, ?)`,
    [user_id, classLevel, island, question_index],
    (err) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ success: true });
    }
  );
});

// API lấy tiến độ
app.get('/progress/:user_id', (req, res) => {
  const { user_id } = req.params;
  db.all(
    `SELECT * FROM progress WHERE user_id = ?`,
    [user_id],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(rows);
    }
  );
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});