import { Request, Response, Router } from 'express';
import { prisma } from '../lib/prisma';
import { hashPassword, comparePasswords, createJWT } from '../services/auth';
import { authMiddleware } from '../middleware/auth';

const router = Router() as Router;

router.post('/signup', async (req: Request, res: Response) => {
  const { email, password, name, brokerId } = req.body;

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
      brokerId,
    },
  });

  const token = createJWT({ id: user.id, email: user.email });
  res.json({ token });
});

router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Missing email or password' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { broker: true },
    });

    if (!user || !(await comparePasswords(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = createJWT({
      id: user.id,
      email: user.email,
      brokerId: user.brokerId,
      role: user.role,
      hasConsentedUserAgreement: user.hasConsentedUserAgreement,
    });
    res.json({ token, user });
  } catch (error) {
    console.error('[login error]', error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
});

router.put('/update-user/:id', async (req: Request, res: Response) => {
  const { email, name, password, newPassword } = req.body;
  const { id } = req.params;

  if (!email || !password) {
    return res.status(400).json({ message: 'Missing email or password' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { broker: true },
    });

    if (!user || !(await comparePasswords(password, user.password))) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const hashed = await hashPassword(newPassword);

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        email: email ?? undefined,
        name: name ?? undefined,
        password: newPassword ? hashed : undefined,
      },
    });

    const token = createJWT({
      id: updatedUser.id,
      email: updatedUser.email,
      brokerId: updatedUser.brokerId,
      role: updatedUser.role,
    });
    res.json({ token, updatedUser });
  } catch (error) {
    console.error('[login error]', error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
});

router
  .use(authMiddleware)
  .put('/reset-password/:id', async (req: Request, res: Response) => {
    const { tempPassword } = req.body;
    const { id } = req.params;
    const role = req.user?.role;

    if (role !== 'ADMIN') return res.status(403).json({ message: 'Forbidden' });

    if (!tempPassword) {
      return res.status(400).json({ message: 'Missing password' });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id },
        include: { broker: true },
      });

      if (!user) {
        return res.status(401).json({ message: 'Cannot find user.' });
      }

      const hashed = await hashPassword(tempPassword);

      const updatedUser = await prisma.user.update({
        where: { id },
        data: {
          password: tempPassword ? hashed : undefined,
        },
      });

      const token = createJWT({
        id: updatedUser.id,
        email: updatedUser.email,
        brokerId: updatedUser.brokerId,
        role: updatedUser.role,
      });
      res.json({ token, updatedUser });
    } catch (error) {
      console.error('[login error]', error);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  });

export default router;
