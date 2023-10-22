import jwt from 'jsonwebtoken'
import { type Encrypter } from '@/data/protocols/criptography/encrypter'
import { type Decrypter } from '@/data/protocols/criptography/decrypter'

export class JwtAdapter implements Decrypter, Encrypter {
  constructor (private readonly secret: string) {}

  async encrypt (value: string): Promise<string> {
    const accessToken = jwt.sign({ id: value }, this.secret)
    return accessToken
  }

  async decrypt (token: string): Promise<string | null> {
    const value = jwt.verify(token, this.secret) as string
    return value
  }
}
