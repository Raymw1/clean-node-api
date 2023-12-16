import { makeDbAddSurvey, makeLogControllerDecorator } from '@/main/factories'
import { AddSurveyController } from '@/presentation/controllers'
import { type Controller } from '@/presentation/protocols'
import { makeAddSurveyValidation } from './add-survey-validation-factory'

export const makeAddSurveyController = (): Controller => {
  const controller = new AddSurveyController(makeAddSurveyValidation(), makeDbAddSurvey())
  return makeLogControllerDecorator(controller)
}
