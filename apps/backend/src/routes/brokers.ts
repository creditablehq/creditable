import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { hashPassword } from '../services/auth';
import { authMiddleware } from '../middleware/auth'; // assumes JWT-based auth middleware
import { Prisma } from '@prisma/client';

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

// GET /brokers/:id - get broker by id
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const broker = await prisma.broker.findFirst({
      where: {
        id,
      },
      include: {
        users: true,
      },
      orderBy: { createdAt: 'asc' },
    });
    res.json(broker);
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

router.patch('/:id', async (req, res) => {
  const brokerId = req.params.id;

  const data = req.body;

  try {
    const updatedBroker = await prisma.broker.update({
      where: { id: brokerId },
      data,
      include: {
        users: true,
      },
    });

    res.json(updatedBroker);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      return res.status(404).json({ error: 'Broker not found' });
    }
    console.error('[PATCH /brokers/:id]', error);
    res.status(500).json({ error: 'Failed to update broker' });
  }
});

export default router;
