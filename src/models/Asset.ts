import { Schema, model, Types } from 'mongoose'

export interface IAsset {
  assetCode: string
  price: number
  currentPrice: number
  profit: number
  quantity: number
  totalInvested: number
  totalValue: number
}

const schema = new Schema<IAsset>(
  {
    assetCode: { type: String, required: true },
    price: { type: Number, required: true },
    currentPrice: { type: Number, required: true },
    profit: { type: Number, required: true },
    quantity: { type: Number, required: true },
    totalInvested: { type: Number, required: true },
    totalValue: { type: Number, required: true },
  },
  { timestamps: true }
)

export const AssetModel = model<IAsset>('Asset', schema)
