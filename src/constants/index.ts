export enum ExpiresInDays {
  Verification = 7,
  ResetPassword = 7
}

export enum Mimetype {
  Jpeg = 'image/jpeg',
  Png = 'image/png'
}

export enum ImageSizeInMb {
  Ten = 10
}

export enum MediaRefType {
  User = 'User'
}

export enum UserTypes {
  Admin = 'Admin',
  User = 'User'
}

export const APP_VERSION_TITLE = 'appversion'

export const API_PREFIX = '/api'
export const API_VERSION = 'v1'
export const API_BASE_PATH = `${API_PREFIX}/${API_VERSION}`

// Element type string constants (useful for consistency across client/server)
export enum ElementTypeString {
  WallGroup = 'WallGroup',
  Floor = 'Floor',
  Wall = 'Wall',
  Ceiling = 'Ceiling',
  Door = 'Door',
  Window = 'Window'
}
