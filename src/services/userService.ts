import { ClientSession, ObjectId } from 'mongoose'

import { User } from '@/models'
import { SubscriptionStatus } from '@/contracts/user'

export const userService = {
  create: (
    {
      email,
      password,
      verified = false,
      firstName,
      lastName,
      userType,
      subscriptionStatus
    }: {
      email: string
      password: string
      verified?: boolean
      firstName?: string
      lastName?: string
      userType?: string
      subscriptionStatus?: SubscriptionStatus
    },
    session?: ClientSession
  ) =>
    new User({
      email,
      password,
      verified,
      firstName,
      lastName,
      userType,
      subscriptionStatus
    }).save({ session }),

  createGoogleUser: (
    {
      email,
      verified = true,
      userType
    }: {
      email: string
      verified?: boolean,
      userType: string
    },
    session?: ClientSession
  ) =>
    new User({
      email,
      verified,
      userType: userType
    }).save({ session }),

  getById: (userId: ObjectId) => User.findById(userId),

  getByEmail: (email: string) => User.findOne({ email }),

  isExistByEmail: (email: string) => User.exists({ email }),

  updatePasswordByUserId: (
    userId: ObjectId,
    password: string,
    session?: ClientSession
  ) => {
    const data = [{ _id: userId }, { password, resetPasswords: [] }]

    let params = null

    if (session) {
      params = [...data, { session }]
    } else {
      params = data
    }

    return User.updateOne(...params)
  },

  updateTypeByMail: (mail: String, userType: string) => {
    const user = User.findOne({ mail: mail })

    if (!user) {
      return null
    }
    const data = [{ email: mail }, { userType: userType }]
    return User.updateOne(...data)
    // return User.updateOne({ email: mail }, { $set: { userType: userType } })
  },

  updateVerificationAndEmailByUserId: (
    userId: ObjectId,
    email: string,
    session?: ClientSession
  ) => {
    const data = [{ _id: userId }, { email, verified: true, verifications: [] }]

    let params = null

    if (session) {
      params = [...data, { session }]
    } else {
      params = data
    }

    return User.updateOne(...params)
  },

  updateProfileByUserId: (
    userId: ObjectId,
    { firstName, lastName }: { firstName: string; lastName: string },
    session?: ClientSession
  ) => {
    const data = [{ _id: userId }, { firstName, lastName }]

    let params = null

    if (session) {
      params = [...data, { session }]
    } else {
      params = data
    }

    return User.updateOne(...params)
  },

  updateEmailByUserId: (
    userId: ObjectId,
    email: string,
    session?: ClientSession
  ) => {
    const data = [{ _id: userId }, { email, verified: false }]

    let params = null

    if (session) {
      params = [...data, { session }]
    } else {
      params = data
    }

    return User.updateOne(...params)
  },

  updateById: (
    userId: ObjectId,
    payload: {
      firstName?: string
      lastName?: string
      userType?: string
      subscriptionStatus?: SubscriptionStatus
      verified?: boolean
    },
    session?: ClientSession
  ) => {
    const data = [{ _id: userId }, { ...payload }]

    let params = null

    if (session) {
      params = [...data, { session }]
    } else {
      params = data
    }

    return User.updateOne(...params)
  },

  deleteById: (userId: ObjectId, session?: ClientSession) =>
    User.deleteOne({ user: userId }, { session }),

  addResetPasswordToUser: async (
    {
      userId,
      resetPasswordId
    }: {
      userId: ObjectId
      resetPasswordId: ObjectId
    },
    session?: ClientSession
  ) => {
    let options = {}

    if (session) {
      options = { session }
    }

    const user = await User.findOne({ _id: userId }, null, options)

    if (user) {
      if (!user.resetPasswords) {
        user.resetPasswords = []
      }
      user.resetPasswords.push(resetPasswordId)
      await user.save({ session })
    }
  },

  addVerificationToUser: async (
    {
      userId,
      verificationId
    }: {
      userId: ObjectId
      verificationId: ObjectId
    },
    session?: ClientSession
  ) => {
    let options = {}

    if (session) {
      options = { session }
    }

    const user = await User.findOne({ _id: userId }, null, options)

    if (user) {
      if (!user.verifications) {
        user.verifications = []
      }
      user.verifications.push(verificationId)
      await user.save({ session })
    }
  }
}
