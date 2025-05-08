# Stock Trading System

A full-stack stock trading simulation platform built with Node.js, MySQL, and React. This system allows users to simulate buying and selling of stocks, view portfolio performance, and track historical price data. Administrators can manage market hours and stock listings. The application is deployed on AWS infrastructure.

## Features

- Real-time stock price simulation with historical charting
- User authentication with role-based access (Customer and Admin)
- Transaction lifecycle: pending, executed, and cancelled
- Portfolio tracking with gain/loss calculation
- Configurable market schedule with auto status updates
- File uploads via AWS S3 integration (for future extensions)
- WebSocket-based live updates using Socket.IO
- Deployment-ready with EC2, RDS (MySQL), and NGINX

## Tech Stack

**Frontend**
- React
- Tailwind CSS
- Axios (HTTP requests)
- Recharts (data visualization)

**Backend**
- Node.js + Express.js
- MySQL (via mysql2)
- Socket.IO
- AWS SDK (v2)

**Infrastructure**
- AWS EC2 (application server)
- AWS RDS (database)
- NGINX (proxy + static frontend hosting)
- GitHub Actions (CI/CD planned)

## Project Structure

```
├── client/                  # React frontend
├── server.js               # Express backend entry point
├── config/
│   └── db.js               # MySQL connection configuration
├── uploads/                # File upload handling (optional)
├── .env                    # Environment variables
└── README.md
```

## Environment Variables

Create a `.env` file in the root directory with the following keys:

```
PORT=3001
SOCKET_PORT=4000
DB_HOST=your-database-host
DB_USER=your-database-username
DB_PASSWORD=your-database-password
DB_NAME=your-database-name
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
FRONTEND_URL=http://your-frontend-url
```

## Getting Started (Local Development)

```bash
# Clone the repository
git clone https://github.com/your-username/StockTrading.git
cd StockTrading

# Install backend dependencies
npm install

# Start the backend server
node server.js

# Start the frontend (in client directory)
cd client
npm install
npm run dev
```

Access the application at `http://localhost:3000`.

## API Endpoints

### Authentication
- `POST /api/register` – Register a new user
- `POST /api/login` – Log in using username or email

### Transactions
- `POST /api/buy` – Create a pending buy order
- `POST /api/sell` – Create a pending sell order
- `POST /api/transactions/cancel` – Cancel a pending transaction
- `GET /api/transactions?userID=...` – Retrieve transaction history

### Portfolio
- `GET /api/portfolio/:userID` – Retrieve user holdings

### Stocks
- `GET /api/data` – Get all stock listings
- `POST /api/addStock` – Add new stock (Admin)
- `PUT /api/stock/:id` – Edit stock data (Admin)
- `DELETE /api/deleteStock/:id` – Delete a stock (Admin)

### Market Controls
- `GET /api/market-schedule`
- `PUT /api/market-schedule/:id`

## User Roles

- **Customer**: Can buy/sell stocks, view portfolio and performance.
- **Admin**: Can configure trading schedule and manage stocks.

## Future Enhancements

- CI/CD pipeline with GitHub Actions and SSH deployment
- Advanced analytics for user portfolios
- Unit and integration testing
- Export capabilities (CSV/PDF)
- Frontend role-based views

## Author

Maintained by Jaime Favela
GitHub: https://github.com/favelaj
