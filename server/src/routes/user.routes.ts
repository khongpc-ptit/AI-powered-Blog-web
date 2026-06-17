import express from 'express'
const userRouters = express.Router()

/**
 * Description: Route for user registration
 * Method: POST
 * Endpoint: /api/users/register
 * Request Body: { name: string, email: string, password: string, confirm_password: string, date_of_birth: ISO8601 string }
 */
userRouters.post('/register')

export default userRouters
