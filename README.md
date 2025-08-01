# Digital Wallet API

A secure, modular, and role-based backend API for a digital wallet system (similar to Bkash or Nagad) built with **Node.js**, **Express.js**, **Mongoose**, and **TypeScript**.

## 🎯 Project Overview

This API implements a complete digital wallet system with three user roles:
- **Users**: Can add money, withdraw, send money to others, and view transaction history
- **Agents**: Can perform cash-in/cash-out operations for users and earn commissions
- **Admins**: Can manage users, agents, wallets, and view system statistics

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication with bcrypt password hashing
- Role-based authorization (user, agent, admin)
- Secure middleware for route protection

### 💰 Wallet Management
- Automatic wallet creation with ৳50 initial balance
- Add money, withdraw, and transfer functionality
- Wallet blocking/unblocking by admins
- Balance validation and transaction safety

### 🔄 Transaction System
- Multiple transaction types: deposit, withdraw, transfer, cash-in, cash-out
- Automatic fee calculation based on transaction type
- Commission tracking for agents
- Comprehensive transaction history

### 👥 User Management
- User registration and login
- Agent approval system
- User status management (active/inactive)
- Role-based access control

### 📊 Admin Dashboard
- View all users, agents, wallets, and transactions
- System statistics and analytics
- Agent approval/suspension
- Wallet blocking/unblocking

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd digital-wallet-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/digital-wallet
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   BCRYPT_ROUNDS=12
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

5. **Run the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm run build
   npm start
   ```

6. **Verify installation**
   ```bash
   curl http://localhost:5000/health
   ```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "01712345678",
  "role": "user" // or "agent"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Wallet Endpoints

#### Get My Wallet (User)
```http
GET /wallets/me
Authorization: Bearer <token>
```

#### Add Money (User)
```http
POST /wallets/add-money
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 1000
}
```

#### Withdraw Money (User)
```http
POST /wallets/withdraw
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 500
}
```

#### Send Money (User)
```http
POST /wallets/send-money
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 200,
  "toUserId": "user_id_here"
}
```

#### Cash In (Agent)
```http
POST /wallets/cash-in
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 1000,
  "userId": "user_id_here"
}
```

#### Cash Out (Agent)
```http
POST /wallets/cash-out
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 500,
  "userId": "user_id_here"
}
```

### Transaction Endpoints

#### Get My Transactions (User)
```http
GET /transactions/my?page=1&limit=10
Authorization: Bearer <token>
```

#### Get Commission History (Agent)
```http
GET /transactions/commissions?page=1&limit=10
Authorization: Bearer <token>
```

### Admin Endpoints

#### Get All Users
```http
GET /users/all?page=1&limit=20&role=user
Authorization: Bearer <token>
```

#### Get All Agents
```http
GET /users/agents?page=1&limit=20
Authorization: Bearer <token>
```

#### Approve/Suspend Agent
```http
PATCH /users/toggle-agent-approval
Authorization: Bearer <token>
Content-Type: application/json

{
  "agentId": "agent_id_here"
}
```

#### Toggle User Status
```http
PATCH /users/toggle-user-status
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": "user_id_here"
}
```

#### Get All Wallets
```http
GET /wallets/all?page=1&limit=20
Authorization: Bearer <token>
```

#### Block/Unblock Wallet
```http
PATCH /wallets/toggle-block
Authorization: Bearer <token>
Content-Type: application/json

{
  "walletId": "wallet_id_here"
}
```

#### Get All Transactions
```http
GET /transactions/all?page=1&limit=20
Authorization: Bearer <token>
```

#### Get Transaction Statistics
```http
GET /transactions/stats
Authorization: Bearer <token>
```

#### Get User Statistics
```http
GET /users/stats
Authorization: Bearer <token>
```

## 🏗️ Project Structure

```
src/
├── config/
│   └── database.ts          # Database connection
├── middlewares/
│   ├── auth.middleware.ts   # Authentication & authorization
│   └── error.middleware.ts  # Error handling
├── modules/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   └── auth.routes.ts
│   ├── user/
│   │   ├── user.controller.ts
│   │   ├── user.model.ts
│   │   └── user.routes.ts
│   ├── wallet/
│   │   ├── wallet.controller.ts
│   │   ├── wallet.model.ts
│   │   └── wallet.routes.ts
│   └── transaction/
│       ├── transaction.controller.ts
│       ├── transaction.model.ts
│       └── transaction.routes.ts
├── types/
│   └── index.ts             # TypeScript interfaces
├── utils/
│   └── jwt.ts              # JWT utilities
└── app.ts                   # Main application file
```

## 🔧 Business Logic

### Transaction Types & Fees
- **Deposit**: No fee
- **Withdraw**: 0.5% or max ৳5
- **Transfer**: 1% or max ৳10
- **Cash-in/Cash-out**: 1% or max ৳15 fee + 0.5% or max ৳10 commission

### Role Permissions
- **Users**: Can manage their own wallet and transactions
- **Agents**: Can perform cash-in/cash-out for users, earn commissions
- **Admins**: Full system access and management capabilities

### Security Features
- Password hashing with bcrypt
- JWT token authentication
- Role-based route protection
- Input validation and sanitization
- Rate limiting
- CORS protection
- Helmet security headers

## 🧪 Testing with Postman

1. **Import the collection** (create a Postman collection with the endpoints above)
2. **Set up environment variables**:
   - `baseUrl`: `http://localhost:5000/api`
   - `token`: (will be set after login)

3. **Test Flow**:
   - Register a user
   - Login and save the token
   - Test wallet operations
   - Test transactions
   - Test admin functions (with admin account)

## 📊 Database Schema

### User Schema
```typescript
{
  email: string (unique),
  password: string (hashed),
  name: string,
  phone: string (unique),
  role: 'user' | 'agent' | 'admin',
  isActive: boolean,
  isApproved: boolean (for agents)
}
```

### Wallet Schema
```typescript
{
  userId: ObjectId (ref: User),
  balance: number (default: 50),
  isBlocked: boolean (default: false)
}
```

### Transaction Schema
```typescript
{
  type: 'deposit' | 'withdraw' | 'transfer' | 'cash-in' | 'cash-out',
  amount: number,
  fee: number,
  commission: number (optional),
  fromWalletId: ObjectId,
  toWalletId: ObjectId (optional),
  fromUserId: ObjectId,
  toUserId: ObjectId (optional),
  initiatedBy: ObjectId,
  status: 'pending' | 'completed' | 'failed' | 'reversed',
  description: string (optional)
}
```

## 🚀 Deployment

### Environment Variables
Make sure to set proper environment variables for production:
- `NODE_ENV=production`
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: A strong, unique secret key
- `PORT`: Your desired port

### Build for Production
```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support or questions, please open an issue in the repository.

---

**Built with ❤️ using Node.js, Express, Mongoose, and TypeScript** 