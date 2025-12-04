'use strict'

const dev = {
  config_id: 'dev',
  mongodb_database_url: process.env.MONGODB_URI_DEV,
  database_name: process.env.MONGODB_DATABASE_NAME_DEV
}

const stg = {
  config_id: 'staging',
  mongodb_database_url: process.env.MONGODB_URI_STG,
  database_name: process.env.MONGODB_DATABASE_NAME_STG
}

const prod = {
  config_id: 'prod',
  mongodb_database_url: process.env.MONGODB_URI_PROD,
  database_name: process.env.MONGODB_DATABASE_NAME_PROD
}

const config = {
  dev,
  stg,
  prod
}

export = config
