# Digital Wallet System - Video Script

## 📹 5-10 Minute Screen Recording Script

### 🎬 **INTRO (30 seconds)**
```
"Hello everyone! My name is [Your Name], and today I'll be demonstrating my Digital Wallet System project.

This is a secure, role-based backend API built with Node.js, Express, TypeScript, and MongoDB. The system supports three user roles: Users who can manage their wallets, Agents who provide cash-in/cash-out services, and Admins who oversee the entire system.

Let me show you how this comprehensive digital wallet platform works!"
```

---

### 📁 **FOLDER STRUCTURE (1 minute)**
```
"Let me start by showing you the project structure. As you can see, this follows a clean, modular architecture:

[Show src/ folder]
- The `src/` directory contains all our source code
- `app.ts` - Main Express application configuration
- `server.ts` - Server startup and management

[Show modules/ folder]
- `modules/` contains our feature-based modules:
  - `auth/` - Authentication and authorization
  - `user/` - User management
  - `wallet/` - Wallet operations
  - `transaction/` - Transaction handling

[Show other folders]
- `middlewares/` - Custom middleware for auth, validation, error handling
- `config/` - Database configuration
- `utils/` - JWT utilities
- `types/` - TypeScript interfaces

This modular structure makes the code maintainable and scalable."
```

---

### 🔐 **AUTHENTICATION/AUTHORIZATION FLOW (1 minute)**
```
"Now let's look at the authentication system. The app uses JWT-based authentication with role-based access control.

[Show registration process]
First, let's register a user. As you can see, we need:
- Name, email, password, phone number
- Role selection (user or agent)
- The system automatically creates a wallet with ৳50 initial balance

[Show login process]
After registration, users can login and receive a JWT token. Notice the token structure includes:
- User ID, email, and role
- Expiration time for security

[Show role-based access]
The system enforces role-based permissions:
- Users can only access user-specific endpoints
- Agents need admin approval before they can login
- Admins have access to all system operations

This ensures secure, controlled access to different features."
```

---

### 👤 **USER FEATURES (1 minute)**
```
"Let me demonstrate the user features. Users can perform several wallet operations:

[Show add money]
- Add money to their wallet with balance validation
- The system tracks all deposits in transaction history

[Show withdraw money]
- Withdraw money with sufficient balance checks
- Cannot withdraw more than available balance

[Show send money]
- Send money to other users with 1% transfer fee
- Real-time balance updates for both sender and receiver
- Transaction status tracking (pending, completed, failed)

[Show balance and history]
- View current wallet balance
- Access complete transaction history with details
- See fees, commissions, and transaction types

All operations include proper validation and error handling."
```

---

### 🏪 **AGENT FEATURES (1 minute)**
```
"Now let's look at agent functionality. Agents provide cash-in and cash-out services:

[Show agent registration]
- Agents register with the same process as users
- They start with ৳50 initial balance like users
- However, they need admin approval before they can login

[Show cash-in operation]
- Agents can add money to user wallets
- They earn 0.5% commission on cash-in operations
- System validates user wallet status before allowing operations

[Show cash-out operation]
- Agents can withdraw money from user wallets
- Same 0.5% commission structure
- Balance validation ensures users have sufficient funds

[Show commission tracking]
- Agents can view their commission earnings
- Detailed transaction history shows all cash-in/cash-out operations
- Commission calculations are transparent and tracked

This creates a complete agent ecosystem for financial services."
```

---

### 👑 **ADMIN FEATURES (1 minute)**
```
"Let me demonstrate the admin capabilities. Admins have comprehensive system oversight:

[Show user management]
- View all users and agents in the system
- See user status, wallet information, and transaction history
- Block or unblock user wallets for security

[Show agent management]
- Approve or suspend agents
- Monitor agent activities and commission earnings
- Control agent access to the system

[Show system statistics]
- View overall system statistics
- Monitor transaction volumes and types
- Track user growth and activity

[Show wallet management]
- View all wallets in the system
- Block/unblock wallets for security reasons
- Monitor wallet balances and activities

Admins have complete control over the digital wallet ecosystem."
```

---

### 🧪 **API TESTING VIA POSTMAN (3-4 minutes)**
```
"Now let's test the API endpoints using Postman. I'll demonstrate key functionality:

[Show Postman collection]
First, let me import the Digital Wallet API collection. This contains all the endpoints organized by functionality.

[Test Authentication]
Let's start with user registration:
- POST /api/auth/register
- Enter user details: name, email, password, phone, role
- [Show successful response with JWT token]

Now login:
- POST /api/auth/login
- [Show token generation and user data]

[Test User Wallet Operations]
With the token in the Authorization header, let's test wallet operations:

Add money to wallet:
- POST /api/wallets/add-money
- [Show successful deposit with updated balance]

Send money to another user:
- POST /api/wallets/send-money
- [Show transfer with fee calculation]

View transaction history:
- GET /api/transactions/my
- [Show detailed transaction list]

[Test Agent Operations]
Now let's test agent functionality. First, register an agent:
- [Show agent registration with isApproved: false]

After admin approval, test cash-in:
- POST /api/wallets/cash-in
- [Show cash-in operation with commission]

[Test Admin Operations]
Switch to admin token and test admin features:

View all users:
- GET /api/users/all
- [Show user list with details]

Block a wallet:
- PATCH /api/wallets/toggle-block
- [Show wallet blocking functionality]

Approve an agent:
- PATCH /api/users/toggle-agent-approval
- [Show agent approval process]

[Show Error Handling]
Let's also test error scenarios:
- Invalid token responses
- Insufficient balance errors
- Validation errors for invalid data
- [Show proper error messages and status codes]

The API provides comprehensive error handling and validation."
```

---

### 🎬 **ENDING (30 seconds)**
```
"Thank you for watching this demonstration of my Digital Wallet System!

This project showcases:
- Secure JWT-based authentication with role-based access
- Comprehensive wallet management with automatic creation
- Multi-role support (User, Agent, Admin)
- Transaction system with fees and commissions
- Complete API testing with Postman collection

The codebase follows best practices with:
- TypeScript for type safety
- Modular architecture for maintainability
- Comprehensive validation and error handling
- Detailed documentation in the README

You can find the complete source code, API documentation, and Postman collection in the repository. The system is production-ready with proper security measures and scalable architecture.

Thanks for your time!"
```

---

## 🎯 **DEMONSTRATION CHECKLIST**

### Technical Setup
- [ ] Start the server: `npm run dev`
- [ ] Open Postman and import collection
- [ ] Have MongoDB running locally
- [ ] Prepare test data examples

### Key Points to Highlight
- [ ] JWT token generation and usage
- [ ] Role-based access control
- [ ] Automatic wallet creation
- [ ] Transaction fee calculations
- [ ] Agent commission system
- [ ] Admin approval workflow
- [ ] Error handling and validation
- [ ] Security features

### Screen Recording Tips
- [ ] Use clear, readable font sizes
- [ ] Highlight important code sections
- [ ] Show both success and error responses
- [ ] Demonstrate real-time balance updates
- [ ] Keep transitions smooth and professional
- [ ] Speak clearly and at a good pace

### Time Management
- Intro: 30s
- Folder Structure: 1m
- Auth Flow: 1m
- User Features: 1m
- Agent Features: 1m
- Admin Features: 1m
- API Testing: 3-4m
- Ending: 30s
- **Total: 8-9 minutes**

---

## 📝 **NOTES FOR RECORDING**

1. **Prepare Test Data**: Have sample users, agents, and transactions ready
2. **Environment Setup**: Ensure server is running and database is connected
3. **Postman Setup**: Import collection and set up environment variables
4. **Screen Recording**: Use high quality recording software
5. **Audio Quality**: Use clear microphone and quiet environment
6. **Pacing**: Speak clearly and don't rush through technical details
7. **Highlights**: Emphasize key features and security measures
8. **Professional Presentation**: Maintain professional tone throughout

This script provides a comprehensive walkthrough of your Digital Wallet System while staying within the 5-10 minute time limit! 