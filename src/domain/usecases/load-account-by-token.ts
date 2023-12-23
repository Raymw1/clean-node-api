export interface LoadAccountByToken {
  load: (params: LoadAccountByToken.Params) => Promise<LoadAccountByToken.Result>
}

export namespace LoadAccountByToken {
  export type Params = {
    accessToken: string
    role?: string
  }

  export type Result = AccountId | null

  type AccountId = {
    id: string
  }
}
