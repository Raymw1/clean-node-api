import { type SurveyResultModel } from '@/domain/models/survey-result'
import { type SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result'

export const mockSurveyResultModel = (): SurveyResultModel => ({
  surveyId: 'any_id',
  question: 'any_question',
  answers: [
    { image: 'any_image', answer: 'any_answer', count: 0, percent: 0 },
    { image: 'other_image', answer: 'other_answer', count: 0, percent: 0 }
  ],
  date: new Date()
})

export const mockSaveSurveyResultParams = (): SaveSurveyResultParams => ({
  accountId: 'any_account_id',
  surveyId: 'any_id',
  answer: 'any_answer',
  date: new Date()
})
