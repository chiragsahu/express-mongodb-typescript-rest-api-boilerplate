import { versionController } from '@/controllers/versionController'
import { Router } from 'express'

export const app_version = (router: Router): void => {
  router.get('/current_app_version', versionController.getCurrentAppVersion)
  router.post('/create_app_version', versionController.createAppVersion)
  router.post('/update_app_version', versionController.updateAppVersion)
}
