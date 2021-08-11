import { Router } from 'express'
import { assetRoutes } from './assetRoutes'

const routes = Router()

routes.use(assetRoutes)

export default routes