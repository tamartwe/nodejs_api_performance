import WorkerPool from './worker_pool.js';
import os from 'os';
import express from 'express';

const pool = new WorkerPool(os.cpus().length);

const port = process.env.PORT || 3000;

const app = express();

const router = express.Router();

router.get('/', async (req, res) => {
  pool.runTask('random_password', (err, result) => {
    return res.json({ 'message': result });
  });
});


app.use('/api', router);

// Start the server
app.listen(port);
console.log('server is up ' + port);


