import { JwtPayload } from '../modules/auth/interfaces/jwt-payload.interface';

// Extend Express Request to include user type
declare module 'express' {
  export interface Request {
    user: JwtPayload;
  }
}
