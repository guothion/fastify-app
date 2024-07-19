const { fetch } = require('undici')
const { setTimeout } = require('node:timers/promises')

const MAGIC_KEY = '12345'

const delay = setTimeout

exports.thirdPartyMagicKeyGenerator = async (ms) => {
  // Simulate processing delay
  await delay(ms)

  // Simulate webhook request to our server
  const { status } = await fetch(
    'http://localhost:1234/webhook',
    {
      body: JSON.stringify({ magicKey: MAGIC_KEY }),
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
    },
  )

  if (status !== 200) {
    throw new Error('Failed to fetch magic key')
  }
}

exports.fetchSensitiveData = async (key) => {
  // Simulate processing delay
  await delay(1700)
  const data = { sensitive: true }

  if (key === MAGIC_KEY) {
    return data
  }

  throw new Error('Invalid key')
}