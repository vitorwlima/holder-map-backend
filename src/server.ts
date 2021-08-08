import dotenv from 'dotenv'
dotenv.config()

import 'reflect-metadata'
import express from 'express'
import 'express-async-errors'

import cors from 'cors'
import { handleError } from './middlewares'

import './database'

const app = express()

app.use(cors({ origin: process.env.ORIGIN, credentials: true }))
app.use(express.json())
app.use(handleError)

app.listen(process.env.PORT || 80, () => console.log('SERVER IS RUNNING'))
