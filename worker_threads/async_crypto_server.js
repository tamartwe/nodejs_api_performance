
import express from 'express';
import crypto from 'crypto';
const port = process.env.PORT || 3000;

const app = express();

const router = express.Router();

const hashPassword = async (password) => {
  return new Promise((resolve, rejected) => {
    const salt = crypto.randomBytes(128).toString('base64');
    const hash = crypto.pbkdf2(password, 
      salt, 10000, 512, 'sha512', (error, hash) => {
        resolve(hash);
     });
  });
}


router.get('/', async (req, res) => {
  const hash = await hashPassword('random_password');
  return res.json({ 'message': hash });
});


app.use('/api', router);

// Start the server
app.listen(port);
console.log('server is up ' + port);







