import express from 'express'
import 'dotenv/config'
import { initDB } from './config/db.js'
import rateLimiter from './middleware/rateLimiter.js'
import transactionsRouter from './routes/transactionsRoute.js'
import job from "./config/cron.js"

if (process.env.NODE_ENV === "production") {
  job.start()
}

const app = express()
const PORT = process.env.PORT || 5001

// middleware
app.use(rateLimiter)
app.use(express.json())

app.get("api/health", (req, res) => {
  res.status(200).json({status: "ok"})
})

app.use("/api/transactions", transactionsRouter)

initDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is up and running on Port:", PORT)
  })
})

