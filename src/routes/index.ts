import { Router } from 'express'

import { auth } from './auth'
import { users } from './users'
import { media } from './media'
import { app_version } from './version'

const router: Router = Router()

const routes: {
  [key: string]: (router: Router) => void
} = { auth, users, media, app_version }

for (const route in routes) {
  routes[route](router)
}

export { router }
