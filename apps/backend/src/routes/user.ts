import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { authMiddleware } from '../middleware/auth'; // assumes JWT-based auth middleware

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
export default router;
