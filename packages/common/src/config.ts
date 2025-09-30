// Centralized Configuration for ExcelDraw
// This file contains all environment variables and configuration

import { z } from "zod";

// Database Configuration
export const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgresql://postgres:mysecretpassword@localhost/draw-app";

// JWT Configuration
export const JWT_SECRET = process.env.JWT_SECRET || "adsfasdfadf";

// Server Ports
export const HTTP_PORT = parseInt(
  process.env.HTTP_PORT || process.env.PORT || "4000",
  10,
);
export const WS_PORT = parseInt(process.env.WS_PORT || "8080", 10);

// API URLs
export const HTTP_BACKEND =
  process.env.NEXT_PUBLIC_HTTP_BACKEND || "http://localhost:4000/api/v1" ;
export const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080";

// Avatar Services
export const AVATAR_PRIMARY_URL =
  process.env.NEXT_PUBLIC_AVATAR_PRIMARY_URL ||
  "https://avatar.iran.liara.run/public";
export const AVATAR_FALLBACK_URL =
  process.env.NEXT_PUBLIC_AVATAR_FALLBACK_URL || "https://ui-avatars.com/api";

// Production Configuration
export const NODE_ENV = process.env.NODE_ENV || "development";
export const IS_PRODUCTION = NODE_ENV === "production";

// CORS Configuration
export const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";

// Logging
export const LOG_LEVEL =
  process.env.LOG_LEVEL || (IS_PRODUCTION ? "error" : "debug");

// Test Credentials (Development Only)
export const TEST_USERNAME =
  process.env.NEXT_PUBLIC_TEST_USERNAME || "test@example.com";
export const TEST_PASSWORD =
  process.env.NEXT_PUBLIC_TEST_PASSWORD || "testpassword123";

// Configuration validation
export function validateConfig() {
  const required = [
    { key: "DATABASE_URL", value: DATABASE_URL },
    { key: "JWT_SECRET", value: JWT_SECRET },
  ];

  const missing = required.filter(({ value }) => !value);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.map((m) => m.key).join(", ")}`,
    );
  }

  if (IS_PRODUCTION && JWT_SECRET === "adsfasdfadf") {
    console.warn(
      "⚠️  Using default JWT_SECRET in production! Please set a strong secret.",
    );
  }
}

// Export all config as a single object for easy importing
export const config = {
  database: {
    url: DATABASE_URL,
  },
  jwt: {
    secret: JWT_SECRET,
  },
  ports: {
    http: HTTP_PORT,
    ws: WS_PORT,
  },
  urls: {
    httpBackend: HTTP_BACKEND,
    wsUrl: WS_URL,
  },
  avatars: {
    primary: AVATAR_PRIMARY_URL,
    fallback: AVATAR_FALLBACK_URL,
  },
  app: {
    nodeEnv: NODE_ENV,
    isProduction: IS_PRODUCTION,
    corsOrigin: CORS_ORIGIN,
    logLevel: LOG_LEVEL,
  },
} as const;

// Zod Schemas for API validation
export const SignupBody = z.object({
  username: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
});

export const SigninBody = z.object({
  username: z.string().email(),
  password: z.string().min(1),
});

export const CreateRoom = z.object({
  name: z.string().min(1),
});
