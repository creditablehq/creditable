import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/auth';
import companyRouter from './routes/companies';
import planRouter from './routes/plan';
import brokerRouter from './routes/brokers';
import userRouter from './routes/user';
import supportTicketRouter from './routes/supportTickets';
import path from 'path';

dotenv.config();

const app = express();
app.use(
  cors({
    origin: 'https://app.joincreditable.com',
    credentials: true,
  })
);
app.use(express.json());
app.use('/static', express.static(path.join(__dirname, '..', 'public')));

app.use('/api/auth', authRouter);
app.use('/api/companies', companyRouter);
app.use('/api/plans', planRouter);
app.use('/api/brokers', brokerRouter);
app.use('/api/users', userRouter);
app.use('/api/supportTickets', supportTicketRouter);

app.get('/', (_req, res) => {
  res.send('Creditable API is live!');
});

app.get('/api/ping', (_req, res) => {
  res.json({ message: 'pong 🏓 from backend' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
