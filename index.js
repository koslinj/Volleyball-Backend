const express = require('express')
const app = express()
const cors = require('cors')

const authRoute = require('./routes/auth')
const refereeRoute = require('./routes/referee')

app.use(cors());
app.use(express.json())

app.use('/auth', authRoute)
app.use('/referee', refereeRoute)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
});