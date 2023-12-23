import { makeDbCheckSurveyById, makeDbLoadSurveyResult, makeLogControllerDecorator } from '@/main/factories'
import { LoadSurveyResultController } from '@/presentation/controllers'
import { type Controller } from '@/presentation/protocols'

export const makeLoadSurveyResultController = (): Controller => {
  const controller = new LoadSurveyResultController(makeDbCheckSurveyById(), makeDbLoadSurveyResult())
  return makeLogControllerDecorator(controller)
}
