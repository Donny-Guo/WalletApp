import express from 'express'
import 'dotenv/config'
import { initDB } from './config/db.js'
import rateLimiter from './middleware/rateLimiter.js'
import transactionsRouter from './routes/transactionsRoute.js'

const app = express()
const PORT = process.env.PORT || 5001

// middleware
app.use(rateLimiter)
app.use(express.json())

app.use("/api/transactions", transactionsRouter)

initDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is up and running on Port:", PORT)
  })
})

