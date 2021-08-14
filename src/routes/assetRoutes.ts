import { Router } from 'express'
import { AssetController } from '../controllers'
import { ensureAuthenticated } from '../middlewares'

export const assetRoutes = Router()
const assetController = new AssetController()

// Create
assetRoutes.post('/asset', ensureAuthenticated, assetController.addAsset)

// Read
assetRoutes.get('/assets', ensureAuthenticated, assetController.listAssets)
