import { Request, Response } from 'express'
import { AssetModel } from '../models'

export class AssetController {
  async createAsset(request: Request, response: Response) {
    const { assetCode, price, quantity } = request.body

    const asset = await AssetModel.findOne({ assetCode })
    if (!asset) {
      const newAsset = await new AssetModel({ assetCode, price, quantity, totalValue: price * quantity }).save()
      return response.json(newAsset)
    }
  }

  async listAssets(request: Request, response: Response) {
    const assets = await AssetModel.find()
    return response.json(assets)
  }
}
