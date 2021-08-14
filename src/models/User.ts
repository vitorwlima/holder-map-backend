import { Schema, model } from 'mongoose'

export interface IUser {
  username: string
  password: string
}

const schema = new Schema<IUser>(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
)

export const UserModel = model<IUser>('User', schema)
