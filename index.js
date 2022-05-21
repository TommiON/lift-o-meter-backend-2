const express = require('express')
const cors = require('cors')
const healthCheckRouter = require('./controllers/healthCheck')
const { PORT } = require('./utils/config')

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/healthcheck', healthCheckRouter)

const start = async () => {
    app.listen(PORT, () => {
        console.log(`Sovellus käynnissä portissa ${PORT}`)
    })
}

start()
