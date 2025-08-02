# 🚀 Vercel Deployment Guide

This guide will help you deploy the Digital Wallet API to Vercel.

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **MongoDB Database**: Set up a MongoDB database (MongoDB Atlas recommended)
3. **Git Repository**: Push your code to GitHub/GitLab/Bitbucket

## 🔧 Environment Variables

Before deploying, you need to set up these environment variables in Vercel:

### Required Variables
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
NODE_ENV=production
```

### Optional Variables
```env
PORT=5000
BCRYPT_ROUNDS=12
```

## 🚀 Deployment Steps

### Method 1: Vercel CLI (Recommended)

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy from your project directory**
```bash
vercel
```

4. **Follow the prompts**:
   - Link to existing project or create new
   - Set up environment variables
   - Deploy

### Method 2: Vercel Dashboard

1. **Connect Repository**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your Git repository

2. **Configure Project**
   - Framework Preset: `Node.js`
   - Root Directory: `./` (default)
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Set Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add all required variables listed above

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

## 🔧 Configuration Files

### vercel.json
```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/api/index.ts"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### package.json Scripts
```json
{
  "scripts": {
    "build": "tsc",
    "vercel-build": "npm run build",
    "start": "node dist/server.js"
  }
}
```

## 🌐 Post-Deployment

### 1. **Test Your API**
```bash
# Health check
curl https://your-app.vercel.app/health

# Expected response
{
  "success": true,
  "message": "Digital Wallet API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 2. **Create Admin User**
After deployment, you'll need to create an admin user. You can do this by:

1. **Using the API directly**:
```bash
curl -X POST https://your-app.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@digitalwallet.com",
    "password": "admin123",
    "phone": "01712345678",
    "role": "admin"
  }'
```

2. **Or modify the create-admin script** to work with the deployed URL

### 3. **Update Postman Collection**
- Replace all `http://localhost:5000` with your Vercel URL
- Test all endpoints

## 🔍 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check TypeScript compilation errors
   - Ensure all dependencies are in `package.json`
   - Verify `tsconfig.json` configuration

2. **Database Connection Issues**
   - Verify `MONGODB_URI` is correct
   - Check MongoDB Atlas network access
   - Ensure database user has proper permissions

3. **Environment Variables**
   - Double-check all required variables are set
   - Ensure no typos in variable names
   - Redeploy after adding new variables

4. **CORS Issues**
   - Update CORS configuration in `app.ts`
   - Add your frontend domain to allowed origins

### Debugging

1. **Check Vercel Logs**
   - Go to your project dashboard
   - Click on "Functions" tab
   - View function logs for errors

2. **Test Locally**
   ```bash
   npm run build
   npm start
   ```

3. **Verify Environment Variables**
   ```bash
   vercel env ls
   ```

## 🔒 Security Considerations

### Production Checklist
- [ ] Use strong `JWT_SECRET`
- [ ] Set up MongoDB Atlas with proper security
- [ ] Configure CORS for your frontend domain
- [ ] Set up rate limiting
- [ ] Use HTTPS (automatic with Vercel)

### Environment Variables Security
- Never commit `.env` files to Git
- Use Vercel's environment variable system
- Rotate secrets regularly
- Use different secrets for staging/production

## 📊 Monitoring

### Vercel Analytics
- Function execution times
- Error rates
- Request volumes

### Custom Monitoring
- Add logging to track API usage
- Monitor database performance
- Set up alerts for errors

## 🔄 Continuous Deployment

### Automatic Deployments
- Vercel automatically deploys on Git pushes
- Configure branch protection rules
- Set up staging environment

### Manual Deployments
```bash
# Deploy to production
vercel --prod

# Deploy to preview
vercel
```

## 📞 Support

If you encounter issues:

1. **Check Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
2. **Review Function Logs**: In your Vercel dashboard
3. **Test Locally**: Ensure it works before deploying
4. **Check Environment Variables**: Verify all are set correctly

---

**Happy Deploying! 🚀** 