import { MongoClient, type Collection } from 'mongodb'

export const MongoHelper = {
  client: null as MongoClient | null,
  uri: null as string | null,

  async connect (uri: string): Promise<void> {
    this.uri = uri
    this.client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  },

  async disconnect (): Promise<void> {
    if (this.client) {
      await this.client.close()
      this.client = null
    }
  },

  async getCollection (name: string): Promise<Collection> {
    if (!this.client?.isConnected()) {
      await this.connect(this.uri)
    }
    return this.client.db().collection(name)
  },

  map<T> (data: any): T {
    const { _id, ...dataWithoutId } = data
    return Object.assign({}, dataWithoutId, { id: _id })
  },

  mapCollection<T> (collection: any[]): T[] {
    return collection.map(MongoHelper.map<T>)
  }
}
