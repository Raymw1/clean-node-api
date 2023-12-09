import { type LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository'
import { type AddSurveyRepository } from '@/data/usecases/survey/add-survey/db-add-survey-protocols'
import { type LoadSurveyByIdRepository } from '@/data/usecases/survey/load-survey-by-id/db-load-survey-by-id-protocols'
import { type SurveyModel } from '@/domain/models/survey'
import { type AddSurveyParams } from '@/domain/usecases/survey/add-survey'
import { ObjectId } from 'mongodb'
import { MongoHelper, QueryBuilder } from '../helpers'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyByIdRepository {
  async add (data: AddSurveyParams): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(data)
  }

  async loadAll (accountId: string): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys')

    const query = new QueryBuilder()
      .lookup({
        from: 'surveyResults',
        foreignField: 'surveyId',
        localField: '_id',
        as: 'result'
      })
      .project({
        _id: 1,
        question: 1,
        answers: 1,
        date: 1,
        didAnswer: {
          $gte: [{
            $size: {
              $filter: {
                input: '$result',
                as: 'item',
                cond: {
                  $eq: ['$$item.accountId', new ObjectId(accountId)]
                }
              }
            }
          }, 1]
        }
      })
      .build()

    const surveys = await surveyCollection.aggregate(query).toArray()
    return MongoHelper.mapCollection<SurveyModel>(surveys)
  }

  async loadById (id: string): Promise<SurveyModel | null> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const survey = await surveyCollection.findOne({ _id: new ObjectId(id) })
    return survey && MongoHelper.map<SurveyModel>(survey)
  }
}
