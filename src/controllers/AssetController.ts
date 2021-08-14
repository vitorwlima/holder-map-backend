import { Request, Response } from 'express'
import { AssetModel } from '../models'
import api from '../services/api'

export class AssetController {
  async addAsset(request: Request, response: Response) {
    const { assetCode, price, quantity } = request.body

    const { data } = await api.get(`/query?function=GLOBAL_QUOTE&symbol=${assetCode}.SAO&apikey=${process.env.API_KEY}`)
    if (!data['Global Quote']['01. symbol']) {
      throw new Error('Código de ação inválido.')
    }

    const currentPrice = data['Global Quote']['05. price']

    const asset = await AssetModel.findOne({ assetCode })
    if (!asset) {
      const assetInfo = {
        assetCode,
        price,
        currentPrice,
        profit: (currentPrice * quantity) / (price * quantity) - 1,
        quantity,
        totalInvested: price * quantity,
        totalValue: currentPrice * quantity,
      }

      const newAsset = await new AssetModel(assetInfo).save()
      return response.json(newAsset)
    }

    const assetInfo = {
      price: (asset.totalInvested + price * quantity) / (asset.quantity + quantity),
      currentPrice,
      profit: (currentPrice * (asset.quantity + quantity)) / (asset.totalInvested + price * quantity) - 1,
      quantity: asset.quantity + quantity,
      totalInvested: asset.totalInvested + price * quantity,
      totalValue: currentPrice * (asset.quantity + quantity),
    }

    const updatedAsset = await AssetModel.findOneAndUpdate({ assetCode }, assetInfo, { new: true, runValidators: true })
    return response.json(updatedAsset)
  }

  async listAssets(request: Request, response: Response) {
    const assets = await AssetModel.find()

    for (const asset of assets) {
      const { data } = await api.get(
        `/query?function=GLOBAL_QUOTE&symbol=${asset.assetCode}.SAO&apikey=${process.env.API_KEY}`
      )
      if (data['Note']) {
        return
      }

      const currentPrice = data['Global Quote']['05. price']

      asset.currentPrice = currentPrice && 200
      asset.profit = (currentPrice * asset.quantity) / (asset.price * asset.quantity) - 1
      asset.totalValue = currentPrice * asset.quantity

      await asset.save()
    }

    return response.json(assets)
  }
}
