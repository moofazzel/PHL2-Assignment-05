export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone: string;
  role?: "user" | "agent";
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      _id: string;
      email: string;
      name: string;
      phone: string;
      role: "user" | "agent" | "admin";
      isActive: boolean;
      isApproved?: boolean;
    };
    token: string;
  };
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: "user" | "agent" | "admin";
}

export interface AuthRequest extends Request {
  user?: {
    _id: string;
    email: string;
    role: "user" | "agent" | "admin";
    isActive: boolean;
    isApproved?: boolean;
  };
}
