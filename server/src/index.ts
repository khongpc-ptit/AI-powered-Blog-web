import express from 'express'
import cors from 'cors'
import authRouter from './routes/auth.routes'
import userRouter from './routes/user.routes'
import blogRouter from './routes/blog.routes'

const app = express()
app.use(cors())
import databaseService from './services/database.services'
import { defaultErrorHandler } from './middlewares/error.middlewares'

const PORT = process.env.PORT || 3000

async function startServer() {
  try {
    await databaseService.connect()
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err)
    process.exit(1)
  }
  //Middleware
  app.use(express.json()) // Middleware để parse JSON body của request
  app.use(express.urlencoded({ extended: true })) // Middleware để parse URL-encoded body của request
  // Routes

  app.use('/api/auth', authRouter)
  app.use('/api/users', userRouter)
  app.use('/api/blogs', blogRouter)

  app.use(defaultErrorHandler) // Middleware xử lý lỗi mặc định
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
}

startServer()
