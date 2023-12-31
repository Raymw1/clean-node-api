export interface AddSurvey {
  add: (survey: AddSurvey.Params) => Promise<void>
}

export namespace AddSurvey {
  export type Params = {
    question: string
    answers: SurveyAnswer[]
    date: Date
  }

  type SurveyAnswer = {
    image?: string
    answer: string
  }
}
