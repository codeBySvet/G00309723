const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';

const dbName = "lecturersDB"
const collName = "lecturers"

var lecturersDB
var lecturers

MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((client) => {
        lecturersDB = client.db(dbName)
        lecturers = lecturersDB.collection(collName)
    })
    .catch((error) => {
        console.log(errors)

    })


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

// Function which ensures that "a new" dept is not added. This will return, the .length will in turn be checked
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

module.exports = { getLecturers, getLecturersAlpha, getLecturersDept, addLecturer, findDept }