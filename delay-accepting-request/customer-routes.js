const fp = require('fastify-plugin')

const provider = require('./provider')

module.exports = fp(async function (fastify) {
  fastify.get('*', async function (request ,reply) {
    try {
        const data = await provider.fetchSensitiveData(request.server.magicKey)
        
      return { customer: true, error: false,data }
    } catch (error) {
      request.log.error({
        error,
        message: 'Failed at fetching sensitive data from provider',
      })

      reply.statusCode = 500
      return { customer: null, error: true }
    }
  })
})