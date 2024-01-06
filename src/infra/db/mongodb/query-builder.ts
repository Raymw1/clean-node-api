export class QueryBuilder {
  private readonly query: object[] = []

  private addStep (step: string, data: object): this {
    this.query.push({
      [step]: data
    })
    return this
  }

  build (): object[] {
    return this.query
  }

  group (data: object): this {
    return this.addStep('$group', data)
  }

  lookup (data: object): this {
    return this.addStep('$lookup', data)
  }

  match (data: object): this {
    return this.addStep('$match', data)
  }

  project (data: object): this {
    return this.addStep('$project', data)
  }

  sort (data: object): this {
    return this.addStep('$sort', data)
  }

  unwind (data: object): this {
    return this.addStep('$unwind', data)
  }
}
