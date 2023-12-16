import { adaptRoute } from '@/main/adapters'
import { makeLoadSurveyResultController, makeSaveSurveyResultController } from '@/main/factories'
import { auth } from '@/main/middlewares'
import { type Router } from 'express'

export default (router: Router): void => {
  router.get('/surveys/:surveyId/results', auth, adaptRoute(makeLoadSurveyResultController()))
  router.put('/surveys/:surveyId/results', auth, adaptRoute(makeSaveSurveyResultController()))
}
