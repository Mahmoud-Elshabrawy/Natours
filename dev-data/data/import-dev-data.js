const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env', quiet: true });

const mongoose = require('mongoose');
const Tour = require('../../models/tourModel');
const Review = require('../../models/reviewModel');
const User = require('../../models/userModel');


const url = process.env.DATABASE.replace('<db_password>',process.env.DATABASE_PASSWORD);

mongoose.connect(url, { autoIndex: true }, {}).then(() => {
    console.log('MongoDB Connected Successfully');
    })
    .catch((err) => {
console.error('DB connection error:', err);
});

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'))
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'))
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'))

async function importToDB() {
    try {
        await Tour.create(tours)
        await User.create(users, {validateBeforeSave: false})
        await Review.create(reviews)

        console.log('Data Successfully Loaded...');
    } catch(err) {
        console.log(err);
    }
    process.exit()
}

async function deleteAllDB() {
    try {
        await Tour.deleteMany()
        await User.deleteMany()
        await Review.deleteMany()

        console.log('Data Successfully Deleted !');
    } catch(err) {
        console.log(err);
    }
    process.exit()
}

if(process.argv[2] === '--import') {
    importToDB()
} else if(process.argv[2] === '--delete'){
    deleteAllDB()
}
console.log(process.argv);
