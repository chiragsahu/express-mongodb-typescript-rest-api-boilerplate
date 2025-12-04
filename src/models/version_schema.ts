import { IVersionSchema } from '@/contracts/version'
import { model, Schema } from 'mongoose'

const schema = new Schema<IVersionSchema>(
  {
    schemaTitle: String,
    version: String,
    versionCode: String,
    releaseDate: String,
    releaseNotes: String,
    helpUrl: String
  },
  { timestamps: true, versionKey: false }
)

export const VersionLog = model<IVersionSchema>('VersionLog', schema)
