import { badRequest, forbidden, notFound, serverError, unauthorized } from './components'
import { loginPath, signUpPath, surveyPath, surveyResultPath } from './paths'
import { accountSchema, addSurveyParamsSchema, apiKeyAuthSchema, errorSchema, loginParamsSchema, saveSurveyResultParamsSchema, signUpParamsSchema, surveyAnswerSchema, surveyResultSchema, surveySchema, surveysSchema } from './schemas'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node API',
    description: 'NodeJs Rest Api using TDD, Clean Architecture and Typescript',
    version: '1.0.0'
  },
  license: {
    name: 'MIT',
    url: 'https://mit-license.org/'
  },
  servers: [{
    url: '/api'
  }],
  tags: [
    { name: 'Login' },
    { name: 'Survey' }
  ],
  paths: {
    '/login': loginPath,
    '/signup': signUpPath,
    '/surveys': surveyPath,
    '/surveys/{surveyId}/results': surveyResultPath
  },
  schemas: {
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
  },
  components: {
    securitySchemes: {
      apiKeyAuth: apiKeyAuthSchema
    },
    badRequest,
    forbidden,
    notFound,
    serverError,
    unauthorized
  }
}
