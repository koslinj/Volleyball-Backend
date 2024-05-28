const express = require('express')
const http = require('http')
const cors = require('cors')

const authRoute = require('./routes/auth')
const refereeConfigurationRoute = require('./routes/referee/configuration')
const refereeMatchesRoute = require('./routes/referee/matches')
const refereeTeamsRoute = require('./routes/referee/teams')
const refereeLiveRoute = require('./routes/referee/live')
const observatorRoute = require('./routes/observator')
const { liveHandler } = require('./websocket/liveHandler')

const app = express()
const server = http.createServer(app)

app.use(cors())
app.use(express.json())

app.use('/auth', authRoute)
app.use('/referee/configuration', refereeConfigurationRoute)
app.use('/referee/matches', refereeMatchesRoute)
app.use('/referee/teams', refereeTeamsRoute)
app.use('/referee/live', refereeLiveRoute)
app.use('/observator', observatorRoute)

// Initialize WebSocket server
liveHandler(server)

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
