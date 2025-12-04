import { NextFunction, Response } from 'express'
import { ObjectId } from 'mongoose'
import validator from 'validator'
import { StatusCodes, ReasonPhrases } from 'http-status-codes'
import winston from 'winston'

import { IBodyRequest } from '@/contracts/request'
import {
  DeleteProfilePayload,
  UpdateEmailPayload,
  UpdatePasswordPayload,
  UpdateProfilePayload,
  VerificationRequestPayload,
  AdminCreateUserPayload,
  AdminUpdateUserPayload,
  SubscriptionStatus
} from '@/contracts/user'
import { UserTypes } from '@/constants'

export const userValidation = {
  adminCreateUser: (
    req: IBodyRequest<AdminCreateUserPayload>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const {
        email,
        password,
        firstName,
        lastName,
        userType,
        subscriptionStatus,
        verified
      } = req.body as AdminCreateUserPayload

      if (!email || !password) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: ReasonPhrases.BAD_REQUEST,
          status: StatusCodes.BAD_REQUEST
        })
      }

      let normalizedEmail = email && validator.normalizeEmail(email)
      if (normalizedEmail) {
        normalizedEmail = validator.trim(normalizedEmail)
      }

      if (
        !normalizedEmail ||
        !validator.isEmail(normalizedEmail, { allow_utf8_local_part: false })
      ) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: ReasonPhrases.BAD_REQUEST,
          status: StatusCodes.BAD_REQUEST
        })
      }

      if (!validator.isLength(password, { min: 6, max: 48 })) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: ReasonPhrases.BAD_REQUEST,
          status: StatusCodes.BAD_REQUEST
        })
      }

      if (firstName) {
        const trimmedFirstName = validator.trim(firstName)
        if (!validator.isLength(trimmedFirstName, { min: 2, max: 48 })) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            message: ReasonPhrases.BAD_REQUEST,
            status: StatusCodes.BAD_REQUEST
          })
        }
        Object.assign(req.body, { firstName: trimmedFirstName })
      }

      if (lastName) {
        const trimmedLastName = validator.trim(lastName)
        if (!validator.isLength(trimmedLastName, { min: 2, max: 48 })) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            message: ReasonPhrases.BAD_REQUEST,
            status: StatusCodes.BAD_REQUEST
          })
        }
        Object.assign(req.body, { lastName: trimmedLastName })
      }

      if (
        userType &&
        ![UserTypes.Admin, UserTypes.User].includes(userType as UserTypes)
      ) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: ReasonPhrases.BAD_REQUEST,
          status: StatusCodes.BAD_REQUEST
        })
      }

      if (
        subscriptionStatus &&
        !Object.values(SubscriptionStatus).includes(
          subscriptionStatus as SubscriptionStatus
        )
      ) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: ReasonPhrases.BAD_REQUEST,
          status: StatusCodes.BAD_REQUEST
        })
      }

      if (verified !== undefined && typeof verified !== 'boolean') {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: ReasonPhrases.BAD_REQUEST,
          status: StatusCodes.BAD_REQUEST
        })
      }

      Object.assign(req.body, { email: normalizedEmail })
      return next()
    } catch (error) {
      winston.error(error)

      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ReasonPhrases.BAD_REQUEST,
        status: StatusCodes.BAD_REQUEST
      })
    }
  },

  adminUpdateUser: (
    req: IBodyRequest<AdminUpdateUserPayload>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const {
        firstName,
        lastName,
        userType,
        subscriptionStatus,
        verified,
        password
      } = req.body as AdminUpdateUserPayload

      if (
        firstName === undefined &&
        lastName === undefined &&
        userType === undefined &&
        subscriptionStatus === undefined &&
        verified === undefined &&
        password === undefined
      ) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: ReasonPhrases.BAD_REQUEST,
          status: StatusCodes.BAD_REQUEST
        })
      }

      if (firstName) {
        const trimmedFirstName = validator.trim(firstName)
        if (!validator.isLength(trimmedFirstName, { min: 2, max: 48 })) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            message: ReasonPhrases.BAD_REQUEST,
            status: StatusCodes.BAD_REQUEST
          })
        }
        Object.assign(req.body, { firstName: trimmedFirstName })
      }

      if (lastName) {
        const trimmedLastName = validator.trim(lastName)
        if (!validator.isLength(trimmedLastName, { min: 2, max: 48 })) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            message: ReasonPhrases.BAD_REQUEST,
            status: StatusCodes.BAD_REQUEST
          })
        }
        Object.assign(req.body, { lastName: trimmedLastName })
      }

      if (
        userType &&
        ![UserTypes.Admin, UserTypes.User].includes(userType as UserTypes)
      ) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: ReasonPhrases.BAD_REQUEST,
          status: StatusCodes.BAD_REQUEST
        })
      }

      if (
        subscriptionStatus &&
        !Object.values(SubscriptionStatus).includes(
          subscriptionStatus as SubscriptionStatus
        )
      ) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: ReasonPhrases.BAD_REQUEST,
          status: StatusCodes.BAD_REQUEST
        })
      }

      if (verified !== undefined && typeof verified !== 'boolean') {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: ReasonPhrases.BAD_REQUEST,
          status: StatusCodes.BAD_REQUEST
        })
      }

      if (password !== undefined) {
        if (!validator.isLength(password, { min: 6, max: 48 })) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            message: ReasonPhrases.BAD_REQUEST,
            status: StatusCodes.BAD_REQUEST
          })
        }
      }

      return next()
    } catch (error) {
      winston.error(error)

      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ReasonPhrases.BAD_REQUEST,
        status: StatusCodes.BAD_REQUEST
      })
    }
  },

  updateUserTypeByMail: (
    req: IBodyRequest<{ email: string; user_type: UserTypes }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.body.email || !req.body.user_type) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: ReasonPhrases.BAD_REQUEST,
          status: StatusCodes.BAD_REQUEST
        })
      }

      let normalizedEmail =
        req.body.email && validator.normalizeEmail(req.body.email)
      if (normalizedEmail) {
        normalizedEmail = validator.trim(normalizedEmail)
      }

      if (
        !normalizedEmail ||
        !validator.isEmail(normalizedEmail, { allow_utf8_local_part: false })
      ) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: ReasonPhrases.BAD_REQUEST,
          status: StatusCodes.BAD_REQUEST
        })
      }

      Object.assign(req.body, {
        email: normalizedEmail,
        user_type: req.body.user_type
      })

      return next()
    } catch (error) {
      winston.error(error)

      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ReasonPhrases.BAD_REQUEST,
        status: StatusCodes.BAD_REQUEST
      })
    }
  },

  verificationRequest: (
    req: IBodyRequest<VerificationRequestPayload>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.body.email) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: ReasonPhrases.BAD_REQUEST,
          status: StatusCodes.BAD_REQUEST
        })
      }

      let normalizedEmail =
        req.body.email && validator.normalizeEmail(req.body.email)
      if (normalizedEmail) {
        normalizedEmail = validator.trim(normalizedEmail)
      }

      if (
        !normalizedEmail ||
        !validator.isEmail(normalizedEmail, { allow_utf8_local_part: false })
      ) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: ReasonPhrases.BAD_REQUEST,
          status: StatusCodes.BAD_REQUEST
        })
      }

      Object.assign(req.body, { email: normalizedEmail })

      return next()
    } catch (error) {
      winston.error(error)

      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ReasonPhrases.BAD_REQUEST,
        status: StatusCodes.BAD_REQUEST
      })
    }
  },

  updateProfile: (
    req: IBodyRequest<UpdateProfilePayload>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.body.firstName || !req.body.lastName) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: ReasonPhrases.BAD_REQUEST,
          status: StatusCodes.BAD_REQUEST
        })
      }

      const trimemdFirstName = validator.trim(req.body.firstName)
      const trimemdLastName = validator.trim(req.body.lastName)

      if (
        !validator.isLength(trimemdFirstName, { min: 2, max: 48 }) ||
        !validator.isLength(trimemdLastName, { min: 2, max: 48 })
      ) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: ReasonPhrases.BAD_REQUEST,
          status: StatusCodes.BAD_REQUEST
        })
      }

      Object.assign(req.body, {
        firstName: trimemdFirstName,
        lastName: trimemdLastName
      })

      return next()
    } catch (error) {
      winston.error(error)

      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ReasonPhrases.BAD_REQUEST,
        status: StatusCodes.BAD_REQUEST
      })
    }
  },

  updateEmail: (
    req: IBodyRequest<UpdateEmailPayload>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.body.email || !req.body.password) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: ReasonPhrases.BAD_REQUEST,
          status: StatusCodes.BAD_REQUEST
        })
      }

      let normalizedEmail =
        req.body.email && validator.normalizeEmail(req.body.email)
      if (normalizedEmail) {
        normalizedEmail = validator.trim(normalizedEmail)
      }

      if (
        !normalizedEmail ||
        !validator.isEmail(normalizedEmail, { allow_utf8_local_part: false })
      ) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: ReasonPhrases.BAD_REQUEST,
          status: StatusCodes.BAD_REQUEST
        })
      }

      Object.assign(req.body, { email: normalizedEmail })

      return next()
    } catch (error) {
      winston.error(error)

      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ReasonPhrases.BAD_REQUEST,
        status: StatusCodes.BAD_REQUEST
      })
    }
  },

  updatePassword: (
    { body: { oldPassword, newPassword } }: IBodyRequest<UpdatePasswordPayload>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (
        !oldPassword ||
        !newPassword ||
        !validator.isLength(newPassword, { min: 6, max: 48 })
      ) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: ReasonPhrases.BAD_REQUEST,
          status: StatusCodes.BAD_REQUEST
        })
      }

      return next()
    } catch (error) {
      winston.error(error)

      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ReasonPhrases.BAD_REQUEST,
        status: StatusCodes.BAD_REQUEST
      })
    }
  },

  updateAvatar: (
    { body: { imageId } }: IBodyRequest<{ imageId: ObjectId }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!imageId) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: ReasonPhrases.BAD_REQUEST,
          status: StatusCodes.BAD_REQUEST
        })
      }

      return next()
    } catch (error) {
      winston.error(error)

      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ReasonPhrases.BAD_REQUEST,
        status: StatusCodes.BAD_REQUEST
      })
    }
  },

  deleteProfile: (
    { body: { password } }: IBodyRequest<DeleteProfilePayload>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!password) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: ReasonPhrases.BAD_REQUEST,
          status: StatusCodes.BAD_REQUEST
        })
      }

      return next()
    } catch (error) {
      winston.error(error)

      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ReasonPhrases.BAD_REQUEST,
        status: StatusCodes.BAD_REQUEST
      })
    }
  }
}
