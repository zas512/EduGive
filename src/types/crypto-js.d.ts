declare module 'crypto-js' {
  export interface AES {
    encrypt(message: string, key: string): CipherParams
    decrypt(ciphertext: string | CipherParams, key: string): WordArray
  }

  export interface CipherParams {
    ciphertext: WordArray
    key?: WordArray
    iv?: WordArray
    algorithm?: string
    mode?: string
    padding?: string
    blockSize?: number
    formatter?: string
    toString(): string
  }

  export interface WordArray {
    words: number[]
    sigBytes: number
    toString(encoder?: string): string
  }

  export interface Enc {
    Utf8: string
  }

  export const AES: AES
  export const enc: { Utf8: string }
} 