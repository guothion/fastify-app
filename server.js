// Import the framework and instantiate it
const Fastify = require('fastify');

const fastify = Fastify({
  logger: true
})

// Declare a route
fastify.get('/', async function handler(request, reply) {
    console.log(request, reply);
  return { hello: 'world' }
})

// Run the server!
try {
    fastify.listen({ port: 3000 }).then(res => { 
        console.log(res);
    })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}