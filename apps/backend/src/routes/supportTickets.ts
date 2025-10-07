// apps/backend/src/routes/companies.ts
import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { authMiddleware } from '../middleware/auth'; // assumes JWT-based auth middleware

const router = Router() as Router;

// Apply auth middleware to all company routes
router.use(authMiddleware);

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
