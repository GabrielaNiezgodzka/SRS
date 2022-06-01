const { MongoClient } = require('mongodb');

// Connection URL
const url = process.env.MONGODB_URI;
const client = new MongoClient(url);

// Database Name
const dbName = 'myProject';

module.exports = {
    connect: () => client.connect(),
    db: () => client.db(dbName),
    users: () => client.db(dbName).collection('users'),
    courses: () => client.db(dbName).collection('courses'),
}