import express from 'express';
import prisma from './db.js';

const app = express();
app.use(express.json());



app.get('/', (req, res) => {
  res.json({ message: 'API is working' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = 3000; 
app.listen(PORT, () => {
  console.log(`Server runs at http://localhost:${PORT}`);
});



// Test databaze
app.get('/db-test', async (req, res) => {
  try {
    await prisma.$connect();
    res.json({ 
      status: 'success',
      message: 'Připojení k databázi funguje!' 
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      message: 'Chyba připojení k databázi',
      error: error.message 
    });
  }
});