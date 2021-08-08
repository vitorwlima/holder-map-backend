import { Schema, model, Types } from 'mongoose'

interface IAsset {
  assetCode: string
  price: number
  quantity: number
  totalValue: number
}

const schema = new Schema<IAsset>(
  {
    assetCode: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    totalValue: { type: Number, required: true },
  },
  { timestamps: true }
)

export const AssetModel = model<IAsset>('Asset', schema)
