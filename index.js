const express = require('express')
const app = express()
const cors = require('cors')

const authRoute = require('./routes/auth')
const refereeConfigurationRoute = require('./routes/referee/configuration')
const refereeMatchesRoute = require('./routes/referee/matches')
const refereeTeamsRoute = require('./routes/referee/teams')
const observatorRoute = require('./routes/observator')

app.use(cors());
app.use(express.json())

app.use('/auth', authRoute)
app.use('/referee/configuration', refereeConfigurationRoute)
app.use('/referee/matches', refereeMatchesRoute)
app.use('/referee/teams', refereeTeamsRoute)
app.use('/observator', observatorRoute)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
});