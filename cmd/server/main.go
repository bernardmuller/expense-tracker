package main

import (
	"context"
	"errors"
	"strings"

	"database/sql"
	"log"
	"os"
	"os/signal"

	"expenny.co.za/internal/store/postgres"
	"github.com/joho/godotenv"

	"github.com/go-telegram/bot"
	"github.com/go-telegram/bot/models"
	_ "github.com/lib/pq"
)

type Config struct {
	DatabaseUrl      string
	TelegramBotToken string
}

type App struct {
	Config Config
	DB     *postgres.Queries
}

type MessageHandler struct {
	DB *postgres.Queries
}

func NewMessageHandler(db *postgres.Queries) *MessageHandler {
	return &MessageHandler{
		DB: db,
	}
}

func (h MessageHandler) onMessage(ctx context.Context, b *bot.Bot, update *models.Update) {
	if update.Message.Text == "/users" {

		users, err := h.DB.GetAllUsers(ctx)
		if err != nil {
			log.Fatalf("failed to fetch users: %v", err)
		}

		names := make([]string, 0, len(users))
		for _, u := range users {
			names = append(names, u.Name)
		}
		b.SendMessage(ctx, &bot.SendMessageParams{
			ChatID: update.Message.Chat.ID,
			Text:   strings.Join(names, ", "),
		})
	}
}

func CreateConfig() (*Config, error) {
	if os.Getenv("ENV") != "production" {
		err := godotenv.Load()
		if err != nil {
			return nil, err
		}
	}

	cfg := Config{
		DatabaseUrl:      os.Getenv("DATABASE_URL"),
		TelegramBotToken: os.Getenv("TELEGRAM_BOT_TOKEN"),
	}

	if cfg.DatabaseUrl == "" || cfg.TelegramBotToken == "" {
		return nil, errors.New("missing env vars")
	}

	return &cfg, nil
}

func CreateApp() (*App, error) {
	cfg, err := CreateConfig()
	if err != nil {
		return nil, err
	}

	conn, err := sql.Open("postgres", cfg.DatabaseUrl)
	if err != nil {
		log.Fatal("failed to connect to database : %w", err)
	}
	db := postgres.New(conn)

	return &App{
		Config: *cfg,
		DB:     db,
	}, nil
}

func main() {
	ctx, cancel := signal.NotifyContext(context.Background(), os.Interrupt)
	defer cancel()

	app, err := CreateApp()
	if err != nil {
		log.Fatal(err)
	}
	h := NewMessageHandler(app.DB)

	opts := []bot.Option{
		bot.WithDefaultHandler(h.onMessage),
	}

	b, err := bot.New(app.Config.TelegramBotToken, opts...)
	if err != nil {
		panic(err)
	}

	b.Start(ctx)
}
