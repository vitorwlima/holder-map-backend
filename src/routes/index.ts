import { Router } from 'express'
import { assetRoutes } from './assetRoutes'
import { userRoutes } from './userRoutes'

const routes = Router()

routes.use(assetRoutes)
routes.use(userRoutes)

export default routes
