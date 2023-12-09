export class QueryBuilder {
  private readonly query: object[] = []

  private addStep (step: string, data: object): QueryBuilder {
    this.query.push({
      [step]: data
    })
    return this
  }

  build (): object[] {
    return this.query
  }

  group (data: object): QueryBuilder {
    return this.addStep('$group', data)
  }

  lookup (data: object): QueryBuilder {
    return this.addStep('$lookup', data)
  }

  match (data: object): QueryBuilder {
    return this.addStep('$match', data)
  }

  project (data: object): QueryBuilder {
    return this.addStep('$project', data)
  }

  sort (data: object): QueryBuilder {
    return this.addStep('$sort', data)
  }

  unwind (data: object): QueryBuilder {
    return this.addStep('$unwind', data)
  }
}
