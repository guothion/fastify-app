const fastify = require('fastify')()

fastify.register(require('@fastify/mysql'), {
    //   connectionString: 'mysql://root@localhost/grade'
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'grade'
})

fastify.get('/user/:id', function(req, reply) {
  fastify.mysql.query(
    'SELECT id, username, gender, email FROM laravel_users WHERE id=?', [req.params.id],
    function onResult (err, result) {
      reply.send(err || result)
    }
  )
})

fastify.listen({ port: 3000 }, err => {
  if (err) throw err
  console.log(`server listening on ${fastify.server.address().port}`)
})