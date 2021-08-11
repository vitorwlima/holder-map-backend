import { Router } from 'express'
import { AssetController } from '../controllers'

export const assetRoutes = Router()
const assetController = new AssetController()

// Create
assetRoutes.post('/asset', assetController.addAsset)

// Read
assetRoutes.get('/assets', assetController.listAssets)
