/**
 * AES加密工具
 * 按后端要求：PKCS5Padding填充 + CBC模式 + Base64编码
 */

import CryptoJS from 'crypto-js'

const AES_KEY = 'TechFlow8DevSecX'
const AES_IV = 'TechFlowVec7ProX'

/**
 * AES加密（CBC模式 + PKCS5Padding + Base64）
 * @param plainText 明文
 * @returns Base64编码的密文
 */
export function aesEncrypt(plainText: string): string {
  const key = CryptoJS.enc.Utf8.parse(AES_KEY)
  const iv = CryptoJS.enc.Utf8.parse(AES_IV)
  
  const encrypted = CryptoJS.AES.encrypt(plainText, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  
  return encrypted.toString()
}

/**
 * AES解密
 * @param cipherText Base64编码的密文
 * @returns 明文
 */
export function aesDecrypt(cipherText: string): string {
  const key = CryptoJS.enc.Utf8.parse(AES_KEY)
  const iv = CryptoJS.enc.Utf8.parse(AES_IV)
  
  const decrypted = CryptoJS.AES.decrypt(cipherText, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  
  return decrypted.toString(CryptoJS.enc.Utf8)
}
