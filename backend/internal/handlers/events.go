package handlers

import (
	"database/sql" // ← Важно: импортируем стандартный пакет

	"event-calendar/internal/database"
	"event-calendar/internal/models"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

// Получить все события или поиск
func GetEvents(c *gin.Context) {
	query := strings.TrimSpace(c.Query("q"))

	var events []models.Event

	var rows *sql.Rows // ← Правильный тип: *sql.Rows, а не database.sql.Rows
	var err error

	if query != "" {
		rows, err = database.DB.Query(
			"SELECT id, title, description, date, created_at FROM events WHERE title LIKE ? ORDER BY date ASC",
			"%"+query+"%",
		)
	} else {
		rows, err = database.DB.Query(
			"SELECT id, title, description, date, created_at FROM events ORDER BY date ASC",
		)
	}

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	for rows.Next() {
		var event models.Event
		var dateStr string
		var createdAtStr string

		err := rows.Scan(&event.ID, &event.Title, &event.Description, &dateStr, &createdAtStr)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		// Парсим даты из строки
		event.Date, _ = time.Parse(time.RFC3339, dateStr)
		event.CreatedAt, _ = time.Parse(time.RFC3339, createdAtStr)

		events = append(events, event)
	}

	c.JSON(http.StatusOK, events)
}

// Создать событие
func CreateEvent(c *gin.Context) {
	var event models.Event
	if err := c.ShouldBindJSON(&event); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	event.CreatedAt = time.Now()

	result, err := database.DB.Exec(
		"INSERT INTO events (title, description, date, created_at) VALUES (?, ?, ?, ?)",
		event.Title,
		event.Description,
		event.Date.Format(time.RFC3339),
		event.CreatedAt.Format(time.RFC3339),
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	id, err := result.LastInsertId()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	event.ID = id

	c.JSON(http.StatusCreated, event)
}

// Обновить событие
func UpdateEvent(c *gin.Context) {
	id := c.Param("id")
	var event models.Event
	if err := c.ShouldBindJSON(&event); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	_, err := database.DB.Exec(
		"UPDATE events SET title = ?, description = ?, date = ? WHERE id = ?",
		event.Title,
		event.Description,
		event.Date.Format(time.RFC3339),
		id,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated", "id": id})
}

// Удалить событие
func DeleteEvent(c *gin.Context) {
	id := c.Param("id")

	result, err := database.DB.Exec("DELETE FROM events WHERE id = ?", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Event not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Deleted"})
}
