-- Sea Strike Database Setup
-- このSQLをSupabase SQL Editorで実行してください

-- usersテーブル作成
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nickname TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- インデックス作成（検索パフォーマンス向上）
CREATE INDEX IF NOT EXISTS idx_users_nickname ON users(nickname);

-- 確認用クエリ
SELECT * FROM users LIMIT 5;
