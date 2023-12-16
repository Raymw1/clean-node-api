import type { Decrypter, Encrypter, HashComparer, Hasher } from '@/data/protocols'
import faker from 'faker'

export class DecrypterSpy implements Decrypter {
  plaintext: string | null = faker.internet.password()
  ciphertext: string

  async decrypt (ciphertext: string): Promise<string | null> {
    this.ciphertext = ciphertext
    return Promise.resolve(this.plaintext)
  }
}
export class EncrypterSpy implements Encrypter {
  ciphertext = faker.random.uuid()
  plaintext: string

  async encrypt (plaintext: string): Promise<string> {
    this.plaintext = plaintext
    return Promise.resolve(this.ciphertext)
  }
}

export class HashComparerSpy implements HashComparer {
  isValid = true
  plaintext: string
  digest: string

  async compare (plaintext: string, digest: string): Promise<boolean> {
    this.plaintext = plaintext
    this.digest = digest
    return Promise.resolve(this.isValid)
  }
}

export class HasherSpy implements Hasher {
  digest = faker.random.uuid()
  plaintext: string

  async hash (plaintext: string): Promise<string> {
    this.plaintext = plaintext
    return await Promise.resolve(this.digest)
  }
}
