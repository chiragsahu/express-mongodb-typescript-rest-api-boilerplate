import cors from 'cors'
import { StatusCodes } from 'http-status-codes'

export const corsMiddleware = cors({
  origin: function (origin: string | undefined, callback: Function) {
    // List of allowed origins
    const allowedOrigins = [
      'http://localhost:4001',
      'https://3d-planner-react.vercel.app',
      'http://localhost:5174',
      'https://kitchendesign3d-admin-demo.vercel.app',
      'http://localhost:3000'
    ]

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true)

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },

  // origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], // Allow all methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
  optionsSuccessStatus: StatusCodes.OK,
  credentials: true
})
