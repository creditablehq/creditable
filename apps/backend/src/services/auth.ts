import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export const hashPassword = (password: string) => {
  return bcrypt.hash(password, 10);
};

export const comparePasswords = (plainText: string, hash: string) => {
  return bcrypt.compare(plainText, hash);
};

export const createJWT = (payload: object) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
};

export function protectRoute(req: any, res: any, next: any) {
  const bearer = req.headers.authorization;

  if (!bearer) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  const [, token] = bearer.split(' ');

  if (!token) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  try {
    const user = jwt.verify(token, JWT_SECRET);
    req.user = user;
    next();
  } catch (e) {
    console.error(e);
    res.status(401).json({ message: 'Not authorized' });
  }
}
