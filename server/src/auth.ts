import type { Request, Response } from 'express';
import { expressjwt } from 'express-jwt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { getUserByEmail, User } from './db/users.js';

const secret = Buffer.from('Zn8Q5tyZ/G1MHltc4F/gTkVJMlrbKiZt', 'base64');

// Extend Express request type to include authenticated user
declare module 'express-serve-static-core' {
  interface Request {
    auth?: JwtPayload & { sub: string; email: string };
  }
}

// Authentication middleware
export const authMiddleware = expressjwt({
  algorithms: ['HS256'],
  credentialsRequired: false,
  secret,
});

// Login handler
export async function handleLogin(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as { email: string; password: string };

  const user: User | undefined = await getUserByEmail(email);
  if (!user || user.password !== password) {
    res.sendStatus(401);
    return;
  }

  const claims = { sub: user.id, email: user.email };
  const token = jwt.sign(claims, secret);

  res.json({ token });
}
