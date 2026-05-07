package database

import (
	"database/sql"
	"log"

	_ "modernc.org/sqlite"
)

var DB *sql.DB // ← Публичная переменная, чтобы использовать в handlers

func ConnectDB() error {
	var err error
	DB, err = sql.Open("sqlite", "file:events.db?_pragma=foreign_keys(1)")
	if err != nil {
		return err
	}

	if err = DB.Ping(); err != nil {
		return err
	}

	createTableSQL := `
	CREATE TABLE IF NOT EXISTS events (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		title TEXT NOT NULL,
		description TEXT,
		date TEXT NOT NULL,
		created_at TEXT DEFAULT CURRENT_TIMESTAMP
	);`

	_, err = DB.Exec(createTableSQL)
	if err != nil {
		return err
	}

	log.Println("✅ Connected to SQLite!")
	return nil
}
