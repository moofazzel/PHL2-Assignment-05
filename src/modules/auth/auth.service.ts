import { generateToken } from "../../utils/jwt";
import { User } from "../user/user.model";
import { Wallet } from "../wallet/wallet.model";
import { AuthResponse, LoginRequest, RegisterRequest } from "./auth.interface";

export const registerUser = async (
  userData: RegisterRequest
): Promise<AuthResponse> => {
  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ email: userData.email }, { phone: userData.phone }],
  });

  if (existingUser) {
    throw new Error("User with this email or phone already exists");
  }

  // Create new user
  const user = new User({
    ...userData,
    isApproved: userData.role === "agent" ? false : undefined,
  });

  await user.save();

  // Create wallet for the user
  const wallet = new Wallet({
    userId: user._id,
    balance: 50, // Initial balance
  });

  await wallet.save();

  // Generate JWT token
  const token = generateToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  return {
    success: true,
    message: "User registered successfully",
    data: {
      user: {
        _id: user._id.toString(),
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
        isApproved: user.isApproved,
      },
      token,
    },
  };
};

export const loginUser = async (
  loginData: LoginRequest
): Promise<AuthResponse> => {
  // Find user by email
  const user = await User.findOne({ email: loginData.email });
  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Check if user is active
  if (!user.isActive) {
    throw new Error("Account is blocked. Please contact support.");
  }

  // Check if agent is approved
  if (user.role === "agent" && !user.isApproved) {
    throw new Error("Agent account is pending approval");
  }

  // Verify password
  const isPasswordValid = await user.comparePassword(loginData.password);
  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  // Generate JWT token
  const token = generateToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  return {
    success: true,
    message: "Login successful",
    data: {
      user: {
        _id: user._id.toString(),
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
        isApproved: user.isApproved,
      },
      token,
    },
  };
};
