/**
 * A plugin that provide encapsulated routes
 * @param {FastifyInstance} fastify encapsulated fastify instance
 * @param {Object} options plugin options, refer to https://www.fastify.io/docs/latest/Reference/Plugins/#plugin-options
 */
async function routes (fastify, options, done) {
    const collection = fastify.mongo.db.collection('test_collection')
  
    fastify.post('/persons', async (request, reply) => {
      const result = await collection.insertOne({ name: request.body.name, age: request.body.age, gender: request.body.gender })
      return result
    });

    fastify.get('/persons', async (request, reply) => {
      const result = await collection.find().toArray()
      if (result.length === 0) {
        throw new Error('No documents found');
      }
      return result;
    });
  
    fastify.get('/persons/:person', async (request, reply) => {
      const result = await collection.findOne({ animal: request.params.animal })
      if (!result) {
        throw new Error('Invalid value');
      }
      return result
    });
  
    done();

  }
  
  export default routes