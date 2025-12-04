import { ObjectId } from 'mongoose'
import { UserTypes } from '@/constants'

export interface IJwtUser {
  id: ObjectId
  userType: UserTypes
}

export interface IAccessToken {
  accessToken: string
}
