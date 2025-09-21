const dotenv = require('dotenv');
dotenv.config({ path: './config.env', quiet: true });

const app = require('./app');

const mongoose = require('mongoose');

const url = process.env.DATABASE.replace(
  '<db_password>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(url,{autoIndex: true}, {
  })
  .then(() => {
    console.log('MongoDB Connected Successfully');
  })
  .catch((err) => {
    console.error('DB connection error:', err);
  });

app.listen(3000, '127.0.0.1', () => {
  console.log(`app running on port 3000...`);
});
