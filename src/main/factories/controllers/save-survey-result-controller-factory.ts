import { makeDbLoadSurveyById, makeDbSaveSurveyResult, makeLogControllerDecorator } from '@/main/factories'
import { SaveSurveyResultController } from '@/presentation/controllers'
import { type Controller } from '@/presentation/protocols'

export const makeSaveSurveyResultController = (): Controller => {
  const controller = new SaveSurveyResultController(makeDbLoadSurveyById(), makeDbSaveSurveyResult())
  return makeLogControllerDecorator(controller)
}
