import { APP_VERSION_TITLE } from '@/constants'
import { VersionLog } from '@/models/version_schema'
import { getRecord, createRecord, updateRecord } from './dbOperationsMongo'

export const versionService = {
  getCurrentAppVersion: async () => {
    const result = await getRecord(VersionLog, {
      schemaTitle: APP_VERSION_TITLE
    })

    if (result.status) {
      return result.data
    }
    return null
  },

  createAppVersion: async (
    version: string,
    versionCode: string,
    releaseDate: string,
    releaseNotes: string,
    helpUrl: string
  ) => {
    const result = await createRecord(VersionLog, {
      schemaTitle: APP_VERSION_TITLE,
      version: version,
      versionCode: versionCode,
      releaseDate: releaseDate,
      releaseNotes: releaseNotes,
      helpUrl: helpUrl
    })

    return result
  },

  updateAppVersion: async (
    version: string,
    versionCode: string,
    releaseDate: string,
    releaseNotes: string,
    helpUrl: string
  ) => {
    const result = await updateRecord(
      VersionLog,
      { schemaTitle: APP_VERSION_TITLE },
      {
        version: version,
        versionCode: versionCode,
        releaseDate: releaseDate,
        releaseNotes: releaseNotes,
        helpUrl: helpUrl
      }
    )

    return result
  }
}
