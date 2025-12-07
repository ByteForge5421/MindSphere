const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => res.status(200).send('OK'));

app.use('/api/auth', require('../routes/auth'));
app.use('/api/users', require('../routes/users'));
app.use('/api/mood', require('../routes/mood'));
app.use('/api/recommendations', require('../routes/recommendations'));
app.use('/api/journal', require('../routes/journal'));
app.use('/api/dashboard', require('../routes/dashboard'));
app.use('/api/community', require('../routes/community'));
app.use('/api/tokens', require('../routes/tokens'));
app.use('/api/plants', require('../routes/plants'));
app.use('/api/mood', require('../routes/geminiMood'));
app.use('/api/messages', require('../routes/messages'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

module.exports = app;
