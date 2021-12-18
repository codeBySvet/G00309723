//Importing express.js to then setup a server
var express = require("express")
var bodyParser = require('body-parser')
var app = express()
//Importing Body Parser to parses incoming request bodies
app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'ejs')
//Importing Css file for styling
app.use('/styles', express.static('styles'))
//Importing Validator
const { validationResult, check } = require('express-validator')
//Importing Databases
var mySQLDAO = require('./mySQLDAO')
var mongoDAO = require('./mongoDAO')


//Get for homepage
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/homePage.html")
})

//---------------------------------------------------------------------MODULES---------------------------------------------------------------------
//Get all modules in Module ID order (default order)
app.get("/listmodules", (req, res) => {
    mySQLDAO.getModules()
        .then((result) => {
            res.render('showModules', { modulesMethod: result })
        })
        //Incase the edit request causes an error, display to the user
        .catch((error) => {
            res.send('<h3> Error Message: <br/> ' + error.errno + " " + error.sqlMessage + ".")
        })
})

//Get all modules in alphabetical order
app.get("/listModulesAlpha", (req, res) => {
    mySQLDAO.getModulesAlpha()
        .then((result) => {
            res.render('showModules', { modulesMethod: result })
        })
        //Incase the edit request causes an error, display to the user
        .catch((error) => {
            res.send('<h3> Error Message: <br/> ' + error.errno + " " + error.sqlMessage + ".")
        })
})

//Get all modules in GPA order
app.get("/listModulesCredits", (req, res) => {
    mySQLDAO.getModulesCredits()
        .then((result) => {
            res.render('showModules', { modulesMethod: result })
        })
        //Incase the edit request causes an error, display to the user
        .catch((error) => {
            res.send('<h3> Error Message: <br/> ' + error.errno + " " + error.sqlMessage + ".")
        })
})

//Get one module (Edit operation)
app.get('/module/edit/:mid', (req, res) => {
    mySQLDAO.getModule(req.params.mid)
        .then((result) => {
            //If the module was located, display it
            if (result.length > 0) {
                res.render('editModule', { errors: undefined, id: result[0].mid, name: result[0].name, credits: result[0].credits })
            } else {
                //If the module could not be located, display the module does not exist to the user
                res.send('<h3>No such module with id: ' + req.params.mid)
            }
        })
        //Incase the edit request causes an error, display to the user
        .catch((error) => {
            res.send('<h3> Error Message: <br/> ' + error.errno + " " + error.sqlMessage + ".")
        })
})

//Post for updating a single modules details
app.post("/module/edit/:mid",
    [check('credits').isInt({ max: 15 }).withMessage("Credits must be 5, 10 or 15"),
    check('credits').isDivisibleBy(5).withMessage("Credits must be 5, 10 or 15"),
    check('name').isLength({ min: 5 }).withMessage("Name must be at least 5 characters")],
    (req, res) => {
        //Checking if validator generated any errors. If yes - display them to user
        var errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.render("editModule", { errors: errors.errors, id: req.body.mid, name: req.body.name, credits: req.body.credits })
        } else {
            //If no errors from validator - edit the module.
            mySQLDAO.editModule(req.body.mid, req.body.name, req.body.credits)
                .then(() => {
                    res.redirect('/listModules')
                })
                //Incase the edit request causes an error, display to the user
                .catch((error) => {
                    res.send('<h3> Error Message: <br/> ' + error.errno + " " + error.sqlMessage + ".")
                })
        }
    })

//Get all students enrolled in a specific Module. Module ID order (default order)
app.get("/module/students/:mid", (req, res) => {
    mySQLDAO.getEnrolled(req.params.mid)
        .then((result) => {
            res.render('showModuleStudents', { studentsMethod: result, mid: req.params.mid })
        })
        //Incase any errors occur, display them to screen
        .catch((error) => {
            res.send('<h3> Error Message: <br/> ' + error.errno + " " + error.sqlMessage + ".")
        })
})

//Get all students enrolled in a specific Module. Alphabetical order
app.get("/module/studentsAlpha/:mid", (req, res) => {
    mySQLDAO.getEnrolledAlpha(req.params.mid)
        .then((result) => {
            res.render('showModuleStudents', { studentsMethod: result, mid: req.params.mid })
        })
        //Incase any errors occur, display them to screen
        .catch((error) => {
            res.send('<h3> Error Message: <br/> ' + error.errno + " " + error.sqlMessage + ".")
        })
})

//Get all students enrolled in a specific Module. GPA order
app.get("/module/studentsGpa/:mid", (req, res) => {
    mySQLDAO.getEnrolledGPA(req.params.mid)
        .then((result) => {
            res.render('showModuleStudents', { studentsMethod: result, mid: req.params.mid })
        })
        //Incase any errors occur, display them to screen
        .catch((error) => {
            res.send('<h3> Error Message: <br/> ' + error.errno + " " + error.sqlMessage + ".")
        })
})

//---------------------------------------------------------------------STUDENTS---------------------------------------------------------------------
//Get all students
app.get("/listStudents", (req, res) => {
    mySQLDAO.getStudents()
        .then((result) => {
            res.render('showstudents', { studentsMethod: result })
        })
        //Incase any errors occur, display them to screen
        .catch((error) => {
            res.send('<h3> Error Message: <br/> ' + error.errno + " " + error.sqlMessage + ".")
        })
})

//Get all students in Alphabetical order
app.get("/listStudentsAlpha", (req, res) => {

    mySQLDAO.getStudentsAlpha()
        .then((result) => {
            res.render('showstudents', { studentsMethod: result })
        })
        //Incase any errors occur, display them to screen
        .catch((error) => {
            res.send('<h3> Error Message: <br/> ' + error.errno + " " + error.sqlMessage + ".")
        })
})

//Get all students in GPA order
app.get("/listStudentsGpa", (req, res) => {
    mySQLDAO.getStudentsGPA()
        .then((result) => {
            res.render('showstudents', { studentsMethod: result })
        })
        .catch((error) => {
            //Incase any errors occur, display them to screen
            res.send('<h3> Error Message: <br/> ' + error.errno + " " + error.sqlMessage + ".")
        })

})

//Get one student (Delete operation)
app.get("/students/delete/:sid", (req, res) => {
    mySQLDAO.deleteStudent(req.params.sid)
        .then((result) => {
            //If the update request did not update anything, likely the user does not exist. Display this error to the user
            if (result.affectedRows == 0) {
                res.send('<h3> Student id: ' + req.params.sid + ' does not exist.')
            } else {
                //If rows were affected, meaning the student is successfully deleted, redirect back to the list students page
                res.redirect("/listStudents")
            }
        })
        //If an error comes back saying the student cant be deleted because they are referenced in 
        //another table, display this specific error to the user
        .catch((error) => {
            if (error.code == "ER_ROW_IS_REFERENCED_2") {
                var errorMsg = req.params.sid + ' has associated modules he/she cannot be deleted.'
                res.render("deleteError", { error: errorMsg })
            } else {
                //Incase any other errors occur, display them to screen
                res.send('<h3> Error Message: <br/> ' + error.errno + " " + error.sqlMessage + ".")
            }
        })
})

//Get one students (Add operation)
app.get("/addStudent", (req, res) => {
    res.render('addStudent', { errors: undefined, errorsTwo: undefined, id: "Please Enter ID", name: "Please Enter Name", gpa: "0" })
})

//Post one students (Add operation)
app.post("/addStudent",
    [check('id').isLength({ min: 4, max: 4 }).withMessage("Student ID must be 4 characters"),
    check('name').isLength({ min: 5 }).withMessage("Name must be at least 5 characters"),
    check('gpa').isFloat({ min: 0.0, max: 4.0 }).withMessage("GPA must be between 0.0 & 4.0")],
    (req, res) => {
        //Checking if the validator generated errors. If yes - Display errors to user
        var errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.render("addStudent", { errors: errors.errors, errorsTwo: undefined })
        } else {
            //If no errors from validator, add the student to the database
            mySQLDAO.addStudent(req.body.id, req.body.name, req.body.gpa)
                .then(() => {
                    res.redirect("/listStudents")
                })
                //Incase any errors occur, display them to screen
                .catch((error) => {
                    var errorstring = ("Error:" + error.code + " " + error.sqlMessage + ".")
                    res.render("addStudent", { errors: undefined, errorsTwo: errorstring })
                })
        }
    })

//---------------------------------------------------------------------LECTURERS---------------------------------------------------------------------
//Get all lecturers
app.get("/listLecturers", (req, res) => {
    mongoDAO.getLecturers()
        .then((documents) => {
            res.render('showLecturers', { LecturersMethod: documents })
        })
        .catch((error) => {
            res.send(error)
        })
})

//Get all lecturers in Alphabetical order
app.get("/listLecturersAlpha", (req, res) => {
    mongoDAO.getLecturersAlpha()
        .then((documents) => {
            res.render('showLecturers', { LecturersMethod: documents })
        })
        .catch((error) => {
            res.send(error)
        })
})

//Get all lecturers in Department name order
app.get("/listLecturersDept", (req, res) => {
    mongoDAO.getLecturersDept()
        .then((documents) => {
            res.render('showLecturers', { LecturersMethod: documents })
        })
        .catch((error) => {
            res.send(error)
        })
})

//Get one lecturers (Add operation)
app.get("/addLecturer", (req, res) => {
    res.render('addLecturer', { errors: undefined, errorsTwo: undefined })
})

//Post one lecturers (Add operation)
app.post("/addLecturer", [
    check('_id').isLength({ min: 4, max: 4 }).withMessage("Lecturer ID must be 4 characters"),
    check('name').isLength({ min: 5 }).withMessage("Name must be at least 5 characters"),
    check('dept').isLength({ min: 3, max: 3 }).withMessage("Dept must be 3 characters")],
    (req, res) => {
        var errors = validationResult(req)
        //Checking if validator generated errors, if yes - output errors to screen
        if (!errors.isEmpty()) {
            res.render("addLecturer", { errors: errors.errors, errorsTwo: undefined, _id: req.body.lid, name: req.body.name, dept: req.body.dept })
        } else {
            //If no errors from validator - then check if the department exists in the database
            mongoDAO.findDept(req.body.dept)
                .then((result) => {
                    if (result.length == 0) {
                        var errorString = ("Dept doesn't exist (entry is case sensative)")
                        res.render("addLecturer", { errors: undefined, errorsTwo: errorString, _id: req.body._id, name: req.body.name, dept: req.body.dept })
                    } else {
                        //If the department exists, add the lecturer to the database
                        mongoDAO.addLecturer(req.body._id, req.body.name, req.body.dept)
                            .then(() => {
                                res.redirect("/listLecturers")
                            })
                            .catch((error) => {
                                //Incase the lecturer is already in the databse, display an error
                                if (error.message.includes("11000")) {
                                    var errorString = ("_id: " + req.body._id + " already exists")
                                    res.render("addLecturer", { errors: undefined, errorsTwo: errorString })
                                } else {
                                    //If some other error occured, display the error
                                    var errorString = ("Error: " + error)
                                    res.render("addLecturer", { errors: undefined, errorsTwo: errorString })
                                }
                            })
                    }
                })
                //Incase attempting to find the department throws an error, let the user know.
                .catch((error) => {
                    res.send(error)
                })
        }
    })

//Server is listening to port 3000
app.listen(3000, () => {
    console.log("Application listending on port 3000")
})