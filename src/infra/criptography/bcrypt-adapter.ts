import bcrypt from 'bcrypt'
import type { HashComparer } from '../../data/protocols/criptography/hash-comparer'
import { type Hasher } from '../../data/protocols/criptography/hasher'

export class BcryptAdapter implements Hasher, HashComparer {
  private readonly salt: number

  constructor (salt: number) {
    this.salt = salt
  }

  async hash (value: string): Promise<string> {
    const hashedValue = await bcrypt.hash(value, this.salt)
    return hashedValue
  }

  async compare (value: string, hash: string): Promise<boolean> {
    await bcrypt.compare(value, hash)
    return false
  }
}
