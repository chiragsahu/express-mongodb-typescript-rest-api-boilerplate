import express, { Express } from 'express'
import 'dotenv/config'

import '@/infrastructure/logger'
import { connectMongo } from '@/dataSources/mongodb'
import {
  corsMiddleware,
  authMiddleware,
  notFoundMiddleware
} from '@/middlewares'
import { router } from '@/routes'
import { API_BASE_PATH } from '@/constants'
import { i18next, i18nextHttpMiddleware } from '@/i18n'

const app: Express = express()
app.use((req, res, next) => {
  console.log('\x1b[32m', `${req.method.toUpperCase()} ${req.path}`)
  next()
})

app.use(
  express.json({ limit: '20mb' }),
  express.urlencoded({ limit: '20mb', extended: true }),
  corsMiddleware,
  i18nextHttpMiddleware.handle(i18next),
  authMiddleware
)
// Add test route
app.get('/test', (req, res) => {
  res.send(
    "&lt;html&gt;&lt;body&gt;all's up and running&lt;/body&gt;&lt;/html&gt;"
  )
})

// app.use(cors(corsOptions))

app.use(API_BASE_PATH, router)

app.use(notFoundMiddleware)

// Start the subscription deactivation scheduler
// subscriptionDeactivationScheduler.start()

const start = async () => {
  try {
    await connectMongo()

    app.listen(process.env.APP_PORT, () => {
      console.log(
        `\x1b[36m`,
        `Server is running at http://localhost:${process.env.APP_PORT}${API_BASE_PATH}`
      )
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

start()
