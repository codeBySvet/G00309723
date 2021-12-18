//Declaring requirments for database setup
const { MongoClient } = require('mongodb');
const url = 'mongodb://localhost:27017';
const dbName = "lecturersDB"
const collName = "lecturers"
var lecturersDB
var lecturers

//Connecting to Mongo Database
MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((client) => {
        lecturersDB = client.db(dbName)
        lecturers = lecturersDB.collection(collName)
    })
    .catch((error) => {
        reject(error)
    })

//Passing querry to databse to search lecturers (ordered by ID)
var getLecturers = function () {
    return new Promise((resolve, reject) => {
        var cursor = lecturers.find()

        cursor.toArray()
            .then((documents) => {
                resolve(documents)
            })
            .catch((errors) => {
                reject(errors)
            })
    })
}

//Passing querry to databse to search lecturers (ordered by lecturer name)
var getLecturersAlpha = function () {
    return new Promise((resolve, reject) => {
        var cursor = lecturers.find().sort( { name: 1 } )

        cursor.toArray()
            .then((documents) => {
                resolve(documents)
            })
            .catch((errors) => {
                reject(errors)
            })
    })
}

//Passing querry to databse to search lecturers (ordered by department name)
var getLecturersDept = function () {
    return new Promise((resolve, reject) => {
        var cursor = lecturers.find().sort( { dept: 1 } )

        cursor.toArray()
            .then((documents) => {
                resolve(documents)
            })
            .catch((errors) => {
                reject(errors)
            })
    })
}

//Passing querry to databse to add a lecturer
var addLecturer = function (_id, name, dept) {
    return new Promise((resolve, reject) => {
        lecturers.insertOne({ "_id": _id, "name": name, "dept": dept })
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

// Function which ensures that a new dept is not added. This will return the length of the response which will in turn be checked to be above 0
function findDept(bodyIn) {
    return new Promise((resolve, reject) => {
        var cursor = lecturers.find({ dept: bodyIn })
        cursor.toArray()
            .then((data) => {
                resolve(data)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

//Marking for export
module.exports = { getLecturers, getLecturersAlpha, getLecturersDept, addLecturer, findDept }