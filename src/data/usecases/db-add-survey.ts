import type { AddSurveyRepository } from '@/data/protocols'
import type { AddSurvey } from '@/domain/usecases'

export class DbAddSurvey implements AddSurvey {
  constructor (private readonly addSurveyRepository: AddSurveyRepository) { }

  async add (survey: AddSurvey.Params): Promise<void> {
    await this.addSurveyRepository.add(survey)
  }
}
