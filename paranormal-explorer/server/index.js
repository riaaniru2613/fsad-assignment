const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);

app.get('/', (req, res) => res.json({ message: 'Paranormal Explorer API running' }));

app.listen(PORT, () => {
  console.log(`👻 Paranormal Explorer server running on http://localhost:${PORT}`);
});
