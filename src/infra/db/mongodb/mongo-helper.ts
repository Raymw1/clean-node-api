import { MongoClient, type Collection } from 'mongodb'

export const MongoHelper = {
  client: null as MongoClient | null,
  uri: null as string | null,

  async connect (uri: string): Promise<void> {
    this.uri = uri
    this.client = await MongoClient.connect(uri)
  },

  async disconnect (): Promise<void> {
    await this.client.close()
    this.client = null
  },

  getCollection (name: string): Collection {
    return this.client.db().collection(name)
  },

  map: <T = string>(data: any): T => {
    const { _id, ...dataWithoutId } = data
    return Object.assign({}, dataWithoutId, { id: _id })
  },

  mapCollection<T> (collection: any[]): T[] {
    return collection.map(MongoHelper.map<T>)
  }
}
