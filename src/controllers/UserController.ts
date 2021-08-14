import { Request, Response } from 'express'
import { sign } from 'jsonwebtoken'
import { compare, hash } from 'bcryptjs'

import { UserModel } from '../models'

export class UserController {
  async register(request: Request, response: Response) {
    const { username, password } = request.body

    const userAlreadyExists = await UserModel.findOne({ username })
    if (userAlreadyExists) {
      throw new Error('Usuário já cadastrado.')
    }

    const passwordHash = await hash(password, 8)
    await new UserModel({ username, password: passwordHash }).save()

    return response.end()
  }

  async authenticate(request: Request, response: Response) {
    const { username, password } = request.body

    const user = await UserModel.findOne({ username })
    if (!user) {
      throw new Error('Usuário não cadastrado.')
    }

    const passwordMatch = await compare(password, user.password)
    if (!passwordMatch) {
      throw new Error('Senha incorreta.')
    }

    const token = sign({}, process.env.TOKEN_HASH!, { subject: user._id.toString(), expiresIn: '12h' })

    return response.json({ user, token })
  }
}
