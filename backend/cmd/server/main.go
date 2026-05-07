package main

import (
	"event-calendar/internal/database"
	"event-calendar/internal/handlers"
	"log"

	"github.com/gin-gonic/gin"
)

func main() {
	// Подключение к БД
	if err := database.ConnectDB(); err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Настройка роутера
	r := gin.Default()

	// 🔥 ВАЖНО: Принудительно устанавливаем UTF-8
	r.Use(func(c *gin.Context) {
		c.Header("Content-Type", "application/json; charset=utf-8")
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	// Маршруты
	api := r.Group("/api")
	{
		events := api.Group("/events")
		{
			events.GET("", handlers.GetEvents)
			events.POST("", handlers.CreateEvent)
			events.PUT("/:id", handlers.UpdateEvent)
			events.DELETE("/:id", handlers.DeleteEvent)
		}
	}

	log.Println("✅ Server starting on port 8080...")
	r.Run(":8080")
}
