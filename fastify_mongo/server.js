// ESM
import Fastify from 'fastify'
import dbConnector from './our-db-connector.js'
import routes from './our-first-route.js'

/**
 * @type {import('fastify').FastifyInstance} Instance of Fastify
 */
const fastify = Fastify({
  logger: false
});


fastify.register(dbConnector);
fastify.register(routes);

fastify.addHook('preHandler', (request, reply, done) => {
  if (request.body) {
    request.log.info({ body: request.body }, 'parsed body')
  }
  done();
});


fastify.listen({ port: 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }  
});