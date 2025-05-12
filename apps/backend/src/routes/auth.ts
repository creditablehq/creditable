import { Request, Response, Router } from 'express';
import { prisma } from '../lib/prisma';
import { hashPassword, comparePasswords, createJWT } from '../services/auth';

const router = Router();

router.post('/signup', async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(400).json({ message: 'Email already in use' });
  }

  const hashed = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashed,
    },
  });

  const token = createJWT({ id: user.id, email: user.email });
  res.json({ token });
});

router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isValid = await comparePasswords(password, user.password);

  if (!isValid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = createJWT({ id: user.id, email: user.email });
  res.json({ token });
});

export default router;
