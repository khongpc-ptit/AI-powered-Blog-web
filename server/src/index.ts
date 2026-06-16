import express from 'express'
import cors from 'cors'
import userRouter from './routes/user.routes'
const app = express()
app.use(cors())
import databaseService from './services/database.services'

const PORT = process.env.PORT || 3000

databaseService.connect().catch(console.error)
//Middleware
app.use(express.json()) // Middleware để parse JSON body của request
app.use(express.urlencoded({ extended: true })) // Middleware để parse URL-encoded body của request
// Routes
app.use('/api/blog')
app.use('/api/users', userRouter)
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`)
})
