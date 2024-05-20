const express = require('express')
const app = express()
const cors = require('cors')

// const authRoutes = require('./routes/auth');
const { fetchMatches } = require('./functions/matches');

app.use(cors());
app.use(express.json());

// app.use('/auth', authRoutes);

app.get('/', async (req, res) => {
  const rows = await fetchMatches();
  console.log(rows)
  res.send(rows)
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});