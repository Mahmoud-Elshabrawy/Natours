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

const port = process.env.PORT || 3000
app.listen(port, '0.0.0.0', () => {
  console.log(`app running on port ${port}...`);
});
