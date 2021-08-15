import { Request, Response } from 'express'
import { AssetModel, UserModel } from '../models'
import api from '../services/api'

export class AssetController {
  async addAsset(request: Request, response: Response) {
    const { user_id } = request
    const { assetCode, price, quantity } = request.body

    const { data } = await api.get(`/query?function=GLOBAL_QUOTE&symbol=${assetCode}.SAO&apikey=${process.env.API_KEY}`)
    if (!data['Global Quote']['01. symbol']) {
      throw new Error('Código de ação inválido.')
    }
    if (data['Note']) {
      throw new Error('Muitas requisições. Tente novamente após 1 minuto.')
    }

    const currentPrice = data['Global Quote']['05. price']

    const asset = await AssetModel.findOne({ assetCode, userId: user_id })
    if (!asset) {
      const assetInfo = {
        assetCode,
        price,
        currentPrice,
        profit: (currentPrice * quantity) / (price * quantity) - 1,
        quantity,
        totalInvested: price * quantity,
        totalValue: currentPrice * quantity,
        userId: user_id,
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
    const { user_id } = request
    const assets = await AssetModel.find({ userId: user_id })

    let totalPrice = 0
    let totalQuantity = 0
    let totalInvested = 0
    let totalValue = 0

    for (const asset of assets) {
      const { data } = await api.get(
        `/query?function=GLOBAL_QUOTE&symbol=${asset.assetCode}.SAO&apikey=${process.env.API_KEY}`
      )
      if (data['Note']) {
        return
      }

      const currentPrice = data['Global Quote']['05. price']

      asset.currentPrice = currentPrice
      asset.profit = (currentPrice * asset.quantity) / (asset.price * asset.quantity) - 1
      asset.totalValue = currentPrice * asset.quantity

      await asset.save()

      totalPrice += asset.price
      totalQuantity += asset.quantity
      totalInvested += asset.totalInvested
      totalValue += asset.totalValue
    }

    const total = {
      assetCode: 'TOTAL',
      price: totalInvested / totalQuantity || 0,
      currentPrice: totalValue / totalQuantity || 0,
      profit: totalValue / totalInvested - 1 || 0,
      quantity: totalQuantity || 0,
      totalInvested: totalInvested || 0,
      totalValue: totalValue || 0,
    }

    const assetsWithTotal = [...assets, total]

    return response.json(assetsWithTotal)
  }
}
