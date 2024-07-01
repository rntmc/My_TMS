import express from 'express'
import dotenv from 'dotenv'
dotenv.config();
import connectDB from './config/db.js';
import loads from './data/loads.js';

const port = process.env.PORT || 5000;

connectDB() //Connect to MongoDB

const app = express();

app.get('/', (req, res) => {
  res.send('API is running...')
})

app.get('/api/loads', (req, res) => {
  res.json(loads)
})

app.get('/api/loads/:id', (req, res) => {
  const load = loads.find((l) => l._id === Number(req.params.id));
  res.json(load)
})

app.listen(port, () => console.log(`Server running on port ${port}`))