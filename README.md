# Digital Wallet API

A secure, modular, and role-based backend API for a digital wallet system built with Node.js, Express, TypeScript, and MongoDB.

## 🚀 Features

### Authentication & Authorization
- **JWT-based authentication** with secure token management
- **Role-based access control** (User, Agent, Admin)
- **Password hashing** using bcrypt
- **Agent approval system** (agents require admin approval)

### Wallet Management
- **Automatic wallet creation** during user/agent registration
- **Initial balance**: ৳50 for all new users and agents
- **Wallet blocking system** (admin-only)
- **Balance validation** for all transactions

### Transaction System
- **Multiple transaction types**: deposit, withdraw, transfer, cash-in, cash-out
- **Fee calculation**: 1% for transfers, 0.5% commission for agent operations
- **Transaction history** with detailed tracking
- **Status tracking**: pending, completed, failed, reversed

### User Roles & Permissions

#### 👤 **User**
- Register and login
- Add money to wallet
- Withdraw money from wallet
- Send money to other users
- View transaction history
- View wallet balance

#### 🏪 **Agent**
- Register and login (requires admin approval)
- Cash-in: Add money to user wallets
- Cash-out: Withdraw money from user wallets
- View commission history
- View transaction history

#### 👑 **Admin**
- View all users, agents, wallets, and transactions
- Block/unblock user wallets
- Approve/suspend agents
- View system statistics
- Manage user status

## 📋 Wallet Management FAQ

### How will wallets be created?
**Wallets are created automatically during user/agent registration.** When a user or agent registers, the system automatically:
1. Creates a new user/agent account
2. Generates a wallet with initial balance of ৳50
3. Links the wallet to the user/agent account

### What happens during registration?
1. **User/Agent Registration**:
   - Validates email, password, name, phone
   - Checks for existing users with same email/phone
   - Creates user/agent account
   - **Automatically creates wallet** with ৳50 initial balance
   - Returns JWT token for authentication

2. **Agent-Specific Process**:
   - Agents are created with `isApproved: false`
   - Must be approved by admin before they can login
   - Still get wallet created during registration

### Will users and agents get wallets?
**Yes, both users and agents get wallets automatically created during registration.**

### What initial balance will users/agents have?
**All new users and agents start with ৳50 initial balance.**

### Can users deactivate wallets?
**No, users cannot deactivate their own wallets.** Only admins can block/unblock wallets through the admin interface.

### What happens when a wallet is blocked?
When a wallet is blocked:
- ❌ **Cannot perform any transactions** (add money, withdraw, send money)
- ❌ **Cannot receive money** from other users
- ❌ **Cannot be used for cash-in/cash-out** by agents
- ✅ **Can still view wallet balance and transaction history**
- ✅ **Can still login to the system**

### Can blocked wallets perform any operation?
**No, blocked wallets cannot perform any financial operations:**
- Cannot add money
- Cannot withdraw money
- Cannot send money
- Cannot receive money
- Cannot be used for agent cash-in/cash-out

**However, blocked wallets can:**
- View balance (read-only)
- View transaction history (read-only)
- Login to the system

## 🛠️ Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Validation**: Zod
- **Security**: Helmet, CORS, Rate Limiting

## 🏗️ Architecture

### Project Structure
```
src/
├── app.ts                 # Express application configuration
├── server.ts              # Server startup and management
├── config/
│   └── database.ts        # MongoDB connection
├── modules/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.routes.ts
│   │   ├── auth.validation.ts
│   │   └── auth.interface.ts
│   ├── user/
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   ├── user.routes.ts
│   │   ├── user.validation.ts
│   │   ├── user.model.ts
│   │   └── user.interface.ts
│   ├── wallet/
│   │   ├── wallet.controller.ts
│   │   ├── wallet.service.ts
│   │   ├── wallet.routes.ts
│   │   ├── wallet.validation.ts
│   │   ├── wallet.model.ts
│   │   └── wallet.interface.ts
│   └── transaction/
│       ├── transaction.controller.ts
│       ├── transaction.service.ts
│       ├── transaction.routes.ts
│       ├── transaction.validation.ts
│       ├── transaction.model.ts
│       └── transaction.interface.ts
├── middlewares/
│   ├── auth.middleware.ts
│   ├── validation.middleware.ts
│   └── error.middleware.ts
├── types/
│   └── common.interface.ts
└── utils/
    └── jwt.ts
```

### Key Design Patterns
- **Service Layer**: Business logic separated from controllers
- **Validation Layer**: Zod schemas for request validation
- **Interface-Driven**: Module-specific TypeScript interfaces
- **Role-Based Access**: Middleware for authorization
- **Error Handling**: Centralized error management

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
Edit `.env` file:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/digital-wallet
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=12
```

4. **Create Admin User**
```bash
npm run create-admin
```

5. **Start Development Server**
```bash
npm run dev
```

The server will start on `http://localhost:5000`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user/agent
- `POST /api/auth/login` - Login user/agent

### User Wallet Operations
- `GET /api/wallets/me` - Get user's wallet
- `POST /api/wallets/add-money` - Add money to wallet
- `POST /api/wallets/withdraw` - Withdraw money from wallet
- `POST /api/wallets/send-money` - Send money to another user

### Agent Operations
- `POST /api/wallets/cash-in` - Add money to user wallet
- `POST /api/wallets/cash-out` - Withdraw money from user wallet

### Transactions
- `GET /api/transactions/my` - Get user's transaction history
- `GET /api/transactions/commissions` - Get agent's commission history

### Admin Operations
- `GET /api/users/all` - Get all users
- `GET /api/users/agents` - Get all agents
- `PATCH /api/users/toggle-user-status` - Block/unblock user
- `PATCH /api/users/toggle-agent-approval` - Approve/suspend agent
- `GET /api/users/stats` - Get user statistics
- `GET /api/wallets/all` - Get all wallets
- `PATCH /api/wallets/toggle-block` - Block/unblock wallet
- `GET /api/transactions/all` - Get all transactions
- `GET /api/transactions/stats` - Get transaction statistics

## 🔐 Security Features

### Authentication
- JWT-based authentication
- Password hashing with bcrypt
- Token expiration handling
- Secure token storage

### Authorization
- Role-based access control
- Route protection middleware
- Agent approval system
- Admin-only operations

### Data Protection
- Input validation with Zod
- SQL injection prevention (MongoDB)
- XSS protection with Helmet
- Rate limiting
- CORS configuration

## 💰 Business Logic

### Transaction Fees
- **Transfer**: 1% of amount
- **Cash-in/Cash-out**: 0.5% commission for agents
- **Deposit/Withdraw**: No fees

### Balance Validation
- Cannot perform transactions with insufficient balance
- Cannot send money to yourself
- Cannot perform operations on blocked wallets
- Fee calculation included in balance checks

### Agent Commission
- Agents earn 0.5% commission on cash-in/cash-out operations
- Commission is tracked in transaction history
- Agents can view their commission earnings

## 🧪 Testing

### Postman Collection
Import the provided Postman collection for testing all endpoints.

### Manual Testing
1. Register a user: `POST /api/auth/register`
2. Login: `POST /api/auth/login`
3. Use the returned token in Authorization header: `Bearer <token>`
4. Test wallet operations and transactions

## 📊 Database Schema

### User Model
```typescript
{
  email: string (unique),
  password: string (hashed),
  name: string,
  phone: string (unique),
  role: "user" | "agent" | "admin",
  isActive: boolean,
  isApproved: boolean (for agents),
  createdAt: Date,
  updatedAt: Date
}
```

### Wallet Model
```typescript
{
  userId: ObjectId (ref: User),
  balance: number (min: 0),
  isBlocked: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Transaction Model
```typescript
{
  type: "deposit" | "withdraw" | "transfer" | "cash-in" | "cash-out",
  amount: number,
  fee: number,
  commission: number,
  fromWalletId: ObjectId (ref: Wallet),
  toWalletId: ObjectId (ref: Wallet),
  fromUserId: ObjectId (ref: User),
  toUserId: ObjectId (ref: User),
  initiatedBy: ObjectId (ref: User),
  status: "pending" | "completed" | "failed" | "reversed",
  description: string,
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables
- `NODE_ENV`: production
- `PORT`: Server port
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT signing
- `JWT_EXPIRES_IN`: Token expiration time

### Docker (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 5000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the API documentation
- Review the Postman collection
- Test with the provided endpoints
- Check server logs for errors

---

**Digital Wallet API** - A secure and scalable wallet management system 🚀 