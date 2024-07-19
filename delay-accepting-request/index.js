const Fastify = require('fastify')

const customerRoutes = require('./customer-routes')
const { setup, delay } = require('./delay-incoming-requests')

const server = new Fastify({ logger: true })

server.register(setup)

// Non-blocked URL
server.get('/ping', function (request, reply) {
  reply.send({ error: false, ready: request.server.magicKey !== null })
})

// Webhook to handle the provider's response - also non-blocked
server.post('/webhook', function (request, reply) {
  // It's good practice to validate webhook requests really come from
  // whoever you expect. This is skipped in this sample for the sake
  // of simplicity

  const { magicKey } = request.body
  request.server.magicKey = magicKey
  request.log.info('Ready for customer requests!+++++++++++++++++++++++')

  reply.send({ error: false })
})

// Blocked URLs
// Mind we're building a new plugin by calling the `delay` factory with our
// customerRoutes plugin
server.register(delay(customerRoutes), { prefix: '/v1' })

server.listen({ port: '1234' })