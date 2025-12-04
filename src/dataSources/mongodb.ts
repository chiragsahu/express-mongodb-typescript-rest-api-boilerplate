import { MongoClient, Db } from 'mongodb'
import mongoose from 'mongoose'
import config from '@/config'

let client: MongoClient | null = null
let dbInstance: Db | null = null

const getMongoConfig = () => {
  const env = process.env.NODE_ENV
  switch (env) {
    case 'dev':
      return {
        url: config.dev.mongodb_database_url,
        dbName: config.dev.database_name
      }
    case 'stg':
      return {
        url: config.stg.mongodb_database_url,
        dbName: config.stg.database_name
      }
    case 'prod':
      return {
        url: config.prod.mongodb_database_url,
        dbName: config.prod.database_name
      }
    default:
      throw new Error('Invalid environment')
  }
}

/**
 * Initialize a singleton MongoDB connection and return the Db instance.
 * Call this once at startup (e.g. from src/index.ts) or lazily from services.
 */
export const connectMongo = async (): Promise<Db> => {
  if (dbInstance) {
    return dbInstance
  }

  const { url, dbName } = getMongoConfig()

  if (!url || !dbName) {
    throw new Error('MongoDB URL or database name is not defined in config')
  }

  client = new MongoClient(url, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 30000,
    connectTimeoutMS: 30000,
    socketTimeoutMS: 45000
  })

  await client.connect()
  dbInstance = client.db(dbName)

  // Also connect Mongoose to the same database
  await mongoose.connect(url, {
    dbName: dbName,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 30000,
    connectTimeoutMS: 30000,
    socketTimeoutMS: 45000
  })

  // eslint-disable-next-line no-console
  console.log(
    '\x1b[32m',
    `MongoDB connected: db="${dbName}" env="${process.env.NODE_ENV}"`
  )
  return dbInstance
}

/**
 * Get the already-connected Db instance.
 * Throws if connectMongo() has not been called yet.
 */
export const getDb = (): Db => {
  if (!dbInstance) {
    throw new Error(
      'MongoDB has not been initialized. Call connectMongo() first.'
    )
  }
  return dbInstance
}

/**
 * Gracefully close the MongoDB connection.
 */
export const closeMongo = async (): Promise<void> => {
  if (client) {
    await client.close()
    client = null
    dbInstance = null
  }
  await mongoose.disconnect()
}
