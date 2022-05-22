const express = require('express')
const cors = require('cors')
const healthCheckRouter = require('./controllers/healthCheck')
const userRouter = require('./controllers/users')
const { PORT } = require('./utils/config')
const { connectToDatabase } = require('./utils/db')

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/healthcheck', healthCheckRouter)
app.use('/api/users', userRouter)

const start = async () => {
    await connectToDatabase()
    app.listen(PORT, () => {
        console.log(`Sovellus käynnissä portissa ${PORT}`)
    })
}

start()
