import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { hashPassword } from '../services/auth';
import { authMiddleware } from '../middleware/auth'; // assumes JWT-based auth middleware

const router = Router() as Router;

// Apply auth middleware to all company routes
router.use(authMiddleware);

// GET /brokers - list all brokers
router.get('/', async (req, res) => {
  try {
    const brokers = await prisma.broker.findMany({
      include: {
        users: true,
      },
      orderBy: { createdAt: 'asc' },
    });
    res.json(brokers);
  } catch (error) {
    console.error('[GET /brokers]', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/', async (req, res) => {
  const { name, totalPlans, userName, email, password } = req.body;

  // validate that all fields exist
  if (!name || !totalPlans || !userName || !email || !password) {
    return res
      .status(403)
      .json({ message: 'Missing required fields to create broker.' });
  }

  const hashed = await hashPassword(password);

  const broker = await prisma.broker.create({
    data: {
      name: name,
      planLimit: totalPlans,
      users: {
        create: {
          name: userName,
          email: email,
          password: hashed,
        },
      },
    },
  });

  res.status(201).json(broker);
});

export default router;
