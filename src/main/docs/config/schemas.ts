import { accountSchema, addSurveyParamsSchema, errorSchema, loginParamsSchema, saveSurveyResultParamsSchema, signUpParamsSchema, surveyAnswerSchema, surveyResultSchema, surveySchema, surveysSchema } from '../schemas'

export const schemas = {
  account: accountSchema,
  addSurveyParams: addSurveyParamsSchema,
  error: errorSchema,
  loginParams: loginParamsSchema,
  saveSurveyResultParams: saveSurveyResultParamsSchema,
  signUpParams: signUpParamsSchema,
  surveyAnswer: surveyAnswerSchema,
  surveyResult: surveyResultSchema,
  survey: surveySchema,
  surveys: surveysSchema
}
