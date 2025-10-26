// apps/backend/src/routes/companies.ts
import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { authMiddleware } from '../middleware/auth'; // assumes JWT-based auth middleware

const router = Router() as Router;

router.use(authMiddleware);

// GET /supportTickets - get all support tickets
router.get('/', async (req, res) => {
  const user = req.user;

  try {
    if (user?.role === 'ADMIN') {
      const supportTickets = await prisma.supportTicket.findMany({
        include: { user: true },
      });
      res.json(supportTickets);
    } else {
      res.status(403).json({ message: 'Not allowed' });
    }
  } catch (error) {
    console.error('[GET /supportTickets]', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /supportTickets - create new support request
router.post('/', async (req, res) => {
  const user = req.user;
  const { type, message } = req.body;

  if (!type || !message) {
    return res
      .status(400)
      .json({ message: 'Request body missing type or message.' });
  }

  const supportTicket = await prisma.supportTicket.create({
    data: {
      type: type,
      message: message,
      userId: user?.id,
    },
  });

  res.status(201).json(supportTicket);
});

export default router;
