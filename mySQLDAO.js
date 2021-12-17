var mysql = require('promise-mysql')
var pool;

mysql.createPool({
    connectionLimit: 4,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'collegedb'
})
    .then((result) => {
        pool = result
    })
    .catch((error) => {
        console.log(error)
    })

//Get all modules 
var getModules = function () {
    return new Promise((resolve, reject) => {
        pool.query('select * from module')
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

//Get all modules in alphabetical order
var getModulesAlpha = function () {
    return new Promise((resolve, reject) => {
        pool.query('select * from module order by name')
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

//Get all students in GPA order
var getModulesCredits = function () {
    return new Promise((resolve, reject) => {
        pool.query('select * from module order by credits;')
            .then((result) => {
                console.log(result)
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

//Get a single module
var getModule = function (mid) {

    return new Promise((resolve, reject) => {
        var myQuery = {
            sql: 'select * from module where mid=?',
            values: [mid]
        }
        pool.query(myQuery)
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

//Edit/update a modules details
var editModule = function (mid, name, credits) {
    return new Promise((resolve, reject) => {

        console.log("name: " + name + " MID: " + mid + " creidts" + credits)

        var myQuery = {
            sql: 'update module set name= ?, credits = ? where mid=?',
            values: [name, credits, mid]
        }
        console.log("mysqlDAO - edit module - .then() ")

        pool.query(myQuery)

            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                // console.log('WERE IN THE ERROR PART OF SQLDAO')
                reject(error)
            })
    })
}


//Add a student to the database
var addStudent = function (sid, name, gpa) {

    return new Promise((resolve, reject) => {

        var myQuery = {
            sql: 'INSERT INTO student (sid, name, gpa) VALUES (?, ?, ?)',
            values: [sid, name, gpa]
        }
        pool.query(myQuery)
            .then((result) => {
                resolve(result)

            })
            .catch((error) => {
                reject(error)
            })
    })
}



//Get all students
var getStudents = function () {
    return new Promise((resolve, reject) => {
        pool.query('select * from student')
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

//Get all students in alphabetical order
var getStudentsAlpha = function () {
    return new Promise((resolve, reject) => {
        pool.query('select * from student order by name')
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}


//Get all students in gpa order
var getStudentsGPA = function () {
    return new Promise((resolve, reject) => {
        pool.query('select * from student order by gpa')
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}


//Get all students enrolled in a certain module
var getEnrolled = function (mid) {
    return new Promise((resolve, reject) => {
        var myQuery = {
            sql: 'select * from student s left join student_module sm on s.sid = sm.sid where sm.mid=?;',
            values: [mid]
        }
        pool.query(myQuery)
            .then((result) => {
                resolve(result)
                //console.log(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

//Get all students enrolled in a certain module in alphabetical order
var getEnrolledAlpha = function (mid) {
    return new Promise((resolve, reject) => {
        var myQuery = {
            sql: 'select * from student s left join student_module sm on s.sid = sm.sid where sm.mid=? order by name;',
            values: [mid]
        }
        pool.query(myQuery)
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

//Get all students enrolled in a certain module  in gpa order
var getEnrolledGPA = function (mid) {
    return new Promise((resolve, reject) => {
        var myQuery = {
            sql: 'select * from student s left join student_module sm on s.sid = sm.sid where sm.mid=? order by gpa;',
            values: [mid]
        }
        pool.query(myQuery)
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}


//Get a single student
var getStudent = function (sid) {
    return new Promise((resolve, reject) => {
        var myQuery = {
            sql: 'select * from student where sid=?',
            values: [sid]
        }
        pool.query(myQuery)
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

//Delete a student from the database
var deleteStudent = function (sid) {
    return new Promise((resolve, reject) => {
        var myQuery = {
            sql: 'delete from student where sid =?',
            values: [sid]
        }
        pool.query(myQuery)
            .then((result) => {
                resolve(result)

            })
            .catch((error) => {
                reject(error)
            })
    })
}


module.exports = { getModule, getModules, getModulesAlpha, getModulesCredits, editModule, 
    
    getEnrolled, getEnrolledAlpha,getEnrolledGPA, 

    getStudent, getStudents, getStudentsAlpha, getStudentsGPA, addStudent, deleteStudent,

    }
