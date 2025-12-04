import { versionService } from '@/services/versionService'
import { Request, Response } from 'express-serve-static-core'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

export const versionController = {
  getCurrentAppVersion: async (req: Request, res: Response) => {
    try {
      const versionData = await versionService.getCurrentAppVersion()
      let response = versionData as any
      if (response && response.versionCode) {
        response.versionCode = parseInt(response.versionCode)
      }

      res.json(response)
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Internal Server Error',
        status: StatusCodes.INTERNAL_SERVER_ERROR
      })
    }
  },
  createAppVersion: async (req: Request, res: Response) => {
    try {
      let { version, versionCode, releaseDate, releaseNotes, helpUrl } =
        req.body
      let versionData = await versionService.createAppVersion(
        version,
        versionCode,
        releaseDate,
        releaseNotes,
        helpUrl
      )
      res.status(StatusCodes.CREATED).json({
        data: versionData,
        message: ReasonPhrases.CREATED,
        status: StatusCodes.CREATED
      })
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Internal Server Error',
        status: StatusCodes.INTERNAL_SERVER_ERROR
      })
    }
  },
  updateAppVersion: async (req: Request, res: Response) => {
    try {
      let { version, versionCode, releaseDate, releaseNotes, helpUrl } =
        req.body
      let versionData = await versionService.updateAppVersion(
        version,
        versionCode,
        releaseDate,
        releaseNotes,
        helpUrl
      )
      res.status(StatusCodes.OK).json({
        data: versionData,
        message: ReasonPhrases.OK,
        status: StatusCodes.OK
      })
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Internal Server Error',
        status: StatusCodes.INTERNAL_SERVER_ERROR
      })
    }
  }
}
