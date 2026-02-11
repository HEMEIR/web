// createUser.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// 创建数据库连接
const dbPath = path.join(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('无法连接到数据库:', err.message);
    process.exit(1);
  } else {
    console.log('成功连接到SQLite数据库');
    
    // 创建用户表
    createTable();
  }
});

// 创建用户表
function createTable() {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
    if (err) {
      console.error('创建用户表失败:', err.message);
      db.close();
      process.exit(1);
    } else {
      console.log('用户表创建成功或已存在');
      
      // 插入用户数据
      insertUser();
    }
  });
}