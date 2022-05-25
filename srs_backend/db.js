const { MongoClient } = require('mongodb');

// Connection URL
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'myProject';

module.exports = {
    connect: () => client.connect(),
    db: () => client.db(dbName),
    users: () => client.db(dbName).collection('users'),
    courses: () => client.db(dbName).collection('courses'),
}