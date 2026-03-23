import Iyzipay from 'iyzipay'

let iyzipay: Iyzipay

function getIyzipay(): Iyzipay {
  if (!iyzipay) {
    iyzipay = new Iyzipay({
      apiKey: process.env.IYZICO_API_KEY || '',
      secretKey: process.env.IYZICO_SECRET_KEY || '',
      uri: process.env.IYZICO_BASE_URL || 'https://sandbox-api.iyzipay.com',
    })
  }
  return iyzipay
}

export { getIyzipay }
