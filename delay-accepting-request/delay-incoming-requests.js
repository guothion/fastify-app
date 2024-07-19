const fp = require('fastify-plugin')

const provider = require('./provider')

const USUAL_WAIT_TIME_MS = 10000

async function setup(fastify) {
  // As soon as we're listening for requests, let's work our magic
  fastify.server.on('listening', doMagic)

  // Set up the placeholder for the magicKey
  fastify.decorate('magicKey', null)

  // Our magic -- important to make sure errors are handled. Beware of async
  // functions outside `try/catch` blocks
  // If an error is thrown at this point and not captured it'll crash the
  // application
  function doMagic() {
    fastify.log.info('Doing magic!------------------')

    provider.thirdPartyMagicKeyGenerator(USUAL_WAIT_TIME_MS)
      .catch((error) => {
        fastify.log.error({
          error,
          message: 'Got an error while trying to get the magic key!'
        })

        // Since we won't be able to serve requests, might as well wrap
        // things up
        fastify.close(() => process.exit(1))
      })
  }
}

const delay = (routes) =>
  function (fastify, opts, done) {
    // Make sure customer requests won't be accepted if the magicKey is not
    // available
    fastify.addHook('onRequest', function (request, reply, next) {
      if (!request.server.magicKey) {
        reply.statusCode = 503
        reply.header('Retry-After', USUAL_WAIT_TIME_MS)
        reply.send({ error: true, retryInMs: USUAL_WAIT_TIME_MS })
      }

      next()
    })

    // Register to-be-delayed routes
    fastify.register(routes, opts)

    done()
  }

module.exports = {
  setup: fp(setup),
  delay,
}