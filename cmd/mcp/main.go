package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"os"

	"expenny.co.za/store/postgres"
	"github.com/joho/godotenv"
	"github.com/mark3labs/mcp-go/mcp"
	"github.com/mark3labs/mcp-go/server"

	_ "github.com/lib/pq"
)

type UsersResponse struct {
	Users []postgres.User `json:"users"`
}

func main() {
	s := server.NewMCPServer(
		"Expenny MCP",
		"1.0.0",
		server.WithToolCapabilities(false),
	)

	if os.Getenv("ENV") != "production" {
		err := godotenv.Load()
		if err != nil {
			log.Fatal("failed to load env: %w", err)
		}
	}

	uri := os.Getenv("DATABASE_URL")
	if uri == "" {
		log.Fatal("failed to load database url")
	}

	db, err := sql.Open("postgres", uri)
	if err != nil {
		log.Fatal("failed to connect to database : %w", err)
	}

	queries := postgres.New(db)

	tool := mcp.NewTool("list_users",
		mcp.WithDescription("List users"),
		mcp.WithOutputSchema[[]postgres.User](),
	)

	s.AddTool(tool, func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
		users, err := queries.GetAllUsers(ctx)
		if err != nil {
			return mcp.NewToolResultError(err.Error()), nil
		}
		res, _ := json.Marshal(users)
		return mcp.NewToolResultText(string(res)), nil
	})

	if err := server.ServeStdio(s); err != nil {
		fmt.Printf("Server error: %v\n", err)
	}
}
