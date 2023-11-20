import { adaptRoute } from '@/main/adapters/express-route-adapter'
import { makeLoadSurveyResultController } from '@/main/factories/controllers/survey-result/load-survey-result/load-survey-result-controller-factory'
import { makeSaveSurveyResultController } from '@/main/factories/controllers/survey-result/save-survey-result/save-survey-result-controller-factory'
import { auth } from '@/main/middlewares/auth'
import { type Router } from 'express'

export default (router: Router): void => {
  router.get('/surveys/:surveyId/results', auth, adaptRoute(makeLoadSurveyResultController()))
  router.put('/surveys/:surveyId/results', auth, adaptRoute(makeSaveSurveyResultController()))
}
