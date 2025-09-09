import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  userId: string;
}

export interface OptionalAuthenticatedRequest extends Request {
  userId?: string;
}
