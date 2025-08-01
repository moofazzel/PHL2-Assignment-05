import dotenv from "dotenv";
import mongoose from "mongoose";
import { User } from "../modules/user/user.model";
import { Wallet } from "../modules/wallet/wallet.model";

dotenv.config();

const createAdmin = async (): Promise<void> => {
  try {
    // Connect to database
    const MONGODB_URI =
      process.env.MONGODB_URI || "mongodb://localhost:27017/digital-wallet";
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log("⚠️ Admin user already exists");
      console.log("Email:", existingAdmin.email);
      console.log("Password: admin123");
      return;
    }

    // Create admin user
    const admin = new User({
      name: "System Admin",
      email: "admin@digitalwallet.com",
      password: "admin123",
      phone: "01700000000",
      role: "admin",
      isActive: true,
    });

    await admin.save();

    // Create admin wallet
    const adminWallet = new Wallet({
      userId: admin._id,
      balance: 1000, // Admin gets ৳1000 initial balance
    });

    await adminWallet.save();

    console.log("✅ Admin user created successfully");
    console.log("Email: admin@digitalwallet.com");
    console.log("Password: admin123");
    console.log("Role: admin");
  } catch (error) {
    console.error("❌ Error creating admin:", error);
  } finally {
    await mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB");
  }
};

// Run the script
createAdmin();
