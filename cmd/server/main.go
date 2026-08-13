package main

import (
	"context"
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

func handler(ctx context.Context, b *bot.Bot, update *models.Update) {
	if update.Message.Text == "/users" {
		uri := os.Getenv("DATABASE_URL")
		if uri == "" {
			log.Fatal("failed to load database url")
		}

		db, err := sql.Open("postgres", uri)
		if err != nil {
			log.Fatal("failed to connect to database : %w", err)
		}

		ctx := context.Background()
		queries := postgres.New(db)

		users, err := queries.GetAllUsers(ctx)
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

func main() {
	if os.Getenv("ENV") != "production" {
		err := godotenv.Load()
		if err != nil {
			log.Fatal("failed to load env: %w", err)
		}
	}

	ctx, cancel := signal.NotifyContext(context.Background(), os.Interrupt)
	defer cancel()

	opts := []bot.Option{
		bot.WithDefaultHandler(handler),
	}

	token := os.Getenv("TELEGRAM_BOT_TOKEN")
	if token == "" {
		log.Fatal("failed to load telegram token")
	}

	b, err := bot.New(token, opts...)
	if err != nil {
		panic(err)
	}

	b.Start(ctx)
}
