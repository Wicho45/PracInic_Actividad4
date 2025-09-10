const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const authRoutes = require('./src/routes/auth.routes');
app.use(core());
app.use(express.json());

app.get('/', (req, res) => res.json({ message: 'API is running' }));

app.use('/api/auth', authRoutes);

app.use("/auth", authRoutes);

