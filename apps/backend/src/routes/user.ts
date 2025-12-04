import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { authMiddleware } from '../middleware/auth'; // assumes JWT-based auth middleware
import { createJWT, hashPassword } from '../services/auth';

const router = Router() as Router;

router.use(authMiddleware);

router.get('/me', async (req, res) => {
  const id = req.user?.id;

  try {
    const me = await prisma.user.findUnique({
      where: { id },
      include: {
        plans: {
          include: {
            evaluations: true,
          },
        },
        broker: true,
      },
    });
    if (me) {
      return res.json(me);
    }

    return res.status(404).json({ message: 'Error getting self' });
  } catch (e) {
    console.error('[GET /me]', e);
    res
      .status(500)
      .json({ message: 'Internal server error: Failed to get /me' });
  }
});

router.get('/', async (req, res) => {
  const role = req.user?.role;

  if (role !== 'ADMIN') return;

  try {
    const users = await prisma.user.findMany({
      include: {
        plans: {
          include: {
            evaluations: true,
          },
        },
        broker: true,
      },
    });
    if (users) {
      return res.json(users);
    }

    return res.status(404).json({ message: 'Error getting users' });
  } catch (e) {
    console.error('[GET /users]', e);
    res
      .status(500)
      .json({ message: 'Internal server error: Failed to get /users' });
  }
});

router.post('/', async (req, res) => {
  const reqRole = req.user?.role;
  const { name, email, role, brokerId } = req.body;

  if (reqRole !== 'ADMIN') return;

  try {
    const tempPassword = `CreditablePartner${new Date().getFullYear()}!`;
    const password = await hashPassword(tempPassword);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        brokerId,
        password,
        role,
      },
    });

    if (user) {
      return res.json(user);
    }

    return res.status(400).json({ message: 'Error creating user' });
  } catch (e) {
    console.error('[POST /users]', e);
    res
      .status(500)
      .json({ message: 'Internal server error: Failed to post /users' });
  }
});

router.put('/:id', async (req, res) => {
  const data = req.body;
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { broker: true },
    });

    if (!user) {
      return res.status(401).json({ message: 'User not found.' });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: data,
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
