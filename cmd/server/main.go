package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"

	"expenny.co.za/internal/store/postgres"
	"github.com/joho/godotenv"

	_ "github.com/lib/pq"
)

func getAllUsers(w http.ResponseWriter, req *http.Request) {
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

	fmt.Printf("names: %v", names)
}

func main() {
	if os.Getenv("ENV") != "production" {
		err := godotenv.Load()
		if err != nil {
			log.Fatal("failed to load env: %w", err)
		}
	}

	http.HandleFunc("/users", getAllUsers)
	fmt.Println("on port 8080")
	http.ListenAndServe(":8080", nil)
}
