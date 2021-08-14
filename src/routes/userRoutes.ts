import { Router } from 'express'
import { UserController } from '../controllers'

export const userRoutes = Router()

const userController = new UserController()

userRoutes.post('/register', userController.register)
userRoutes.post('/authenticate', userController.authenticate)
