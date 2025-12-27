# football-manager-be
It is a backend service used for a football fantasy manager that allows users to manage their teams and buy players
Implemented using Node.js, Nest.js, PostgreSQL and TypeORM.

# Build and run the project in development mode
To build and run the application use
docker-compose up -d --build

# To run all tests use
npm run test

# To open swagger documentation use
http://localhost:3000/api

# Features
1. User Management
  - Register/login using email and password (single flow for both)
2. Team Management
  - Each new user automatically receives a team with a budget of $5,000,000 and 20 players:
    - 3 Goalkeepers
    - 6 Defenders
    - 6 Midfielders
    - 5 Attackers
  - Team creation is handled asynchronously using Bull + Redis.
3. Transfer Market
  - Filter players by team name, player name, and price
  - Add/remove players from the transfer list with a specific asking price
  - Buy players from other teams at 95% of their asking price
  - Teams must always have between 15–25 players

# Prerequisites
1. Docker & Docker Compose installed
2. Node.js >= 18.x (if running locally without Docker)
3. Redis & PostgreSQL running (handled automatically by Docker Compose)
