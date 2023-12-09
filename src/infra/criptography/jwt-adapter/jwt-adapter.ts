import { type Decrypter } from '@/data/protocols/criptography/decrypter'
import { type Encrypter } from '@/data/protocols/criptography/encrypter'
import jwt from 'jsonwebtoken'

export class JwtAdapter implements Decrypter, Encrypter {
  constructor (private readonly secret: string) {}

  async encrypt (plaintext: string): Promise<string> {
    const accessToken = jwt.sign({ id: plaintext }, this.secret)
    return accessToken
  }

  async decrypt (ciphertext: string): Promise<string | null> {
    try {
      const value = jwt.verify(ciphertext, this.secret) as string
      return value
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return null
      }
      throw error
    }
  }
}
