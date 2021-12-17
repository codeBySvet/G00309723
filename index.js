//Importing express.js to then setup a server
var express = require("express")
var ejs = require('ejs')
var bodyParser = require('body-parser')
var app = express()
const { dataArray } = require('./static/modulesFile')
var dataFile = require('./static/modulesFile')
var studentsDataFile = require('./static/studentsFile')
const { body, validationResult, check, Result } = require('express-validator')
var mySQLDAO = require('./mySQLDAO')
//const { Pool } = require("promise-mysql")
var mongoDAO = require('./mongoDAO')

app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'ejs')
app.use('/styles', express.static('styles'))

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/homePage.html")
})

//-------------------------------------------MODULES------------------------------------------------------

//GET all modules in Module ID order (default order)
app.get("/listmodules", (req, res) => {
    mySQLDAO.getModules()
        .then((result) => {
            res.render('showModules', { modulesMethod: result })
        })
        .catch((error) => {
            res.send(error)
        })
})

//GET all modules in alphabetical order
app.get("/listModulesAlpha", (req, res) => {
    mySQLDAO.getModulesAlpha()
        .then((result) => {
            res.render('showModules', { modulesMethod: result })
        })
        .catch((error) => {
            res.send(error)
        })
})

//GET all modules in GPA order
app.get("/listModulesCredits", (req, res) => {
    mySQLDAO.getModulesCredits()
        .then((result) => {
            res.render('showModules', { modulesMethod: result })
        })
        .catch((error) => {
            res.send(error)
        })
})

//GET one module
app.get('/module/edit/:mid', (req, res) => {
    mySQLDAO.getModule(req.params.mid)
        .then((result) => {

            if (result.length > 0) {

                res.render('editModule', { errors: undefined, id: result[0].mid, name: result[0].name, credits: result[0].credits })

            } else {
                res.send('<h3>No such module with id: ' + req.params.mid)
            }
        })
        .catch((error) => {
            res.send(error)
        })

})

//Post for updating a single modules details
app.post("/module/edit/:mid",
    [check('credits').isInt({ max: 15 }).withMessage("Credits must be 5, 10 or 15"),
    check('credits').isDivisibleBy(5).withMessage("Credits must be 5, 10 or 15"),
    check('name').isLength({ min: 5 }).withMessage("Name must be at least 5 characters")],
    (req, res) => {

        var errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.render("editModule", { errors: errors.errors, id: req.body.mid, name: req.body.name, credits: req.body.credits })
        } else {
            mySQLDAO.editModule(req.body.mid, req.body.name, req.body.credits)

            res.redirect('/listModules')
        }
    })


//GET all students enrolled in a specific Module. Module ID order (default order)
app.get("/module/students/:mid", (req, res) => {
    mySQLDAO.getEnrolled(req.params.mid)
        .then((result) => {
            console.log("maybe got it "+req.params.mid)
            res.render('showModuleStudents', { studentsMethod: result,  mid: req.params.mid })
        })
        .catch((error) => {
            res.send(error)
        })

})

//GET all students enrolled in a specific Module. Alphabetical order
app.get("/module/studentsAlpha/:mid", (req, res) => {
    mySQLDAO.getEnrolledAlpha(req.params.mid)
        .then((result) => {
            res.render('showModuleStudents', { studentsMethod: result,  mid: req.params.mid })

        })
        .catch((error) => {

            res.send(error)
        })

})

//GET all students enrolled in a specific Module. GPA order
app.get("/module/studentsGpa/:mid", (req, res) => {
    mySQLDAO.getEnrolledGPA(req.params.mid)
        .then((result) => {
            res.render('showModuleStudents', { studentsMethod: result,  mid: req.params.mid })
        })
        .catch((error) => {
            res.send(error)
        })

})

//------------------------------------------STUDENTS----------------------------------------------------

//GET all students
app.get("/listStudents", (req, res) => {
    mySQLDAO.getStudents()
        .then((result) => {
            res.render('showstudents', { studentsMethod: result })
        })
        .catch((error) => {
            res.send(error)
        })
})


app.get("/sortByName", (req,res)=>{

    mySQLDAO.getStudentsAlpha()
        .then((result) => {
            res.render('showstudents', { studentsMethod: result })
        })
        .catch((error) => {
            res.send(error)
        })
    
})

app.get("/sortByGPA", (req,res)=>{

    mySQLDAO.getStudentsGPA()
        .then((result) => {
            res.render('showstudents', { studentsMethod: result })
        })
        .catch((error) => {
            res.send(error)
        })
    
})


//GET one student (Delete operation)
app.get("/students/delete/:sid", (req, res) => {
    mySQLDAO.deleteStudent(req.params.sid)
        .then((result) => {


            if (result.affectedRows == 0) {

                res.send('<h3> Student id: ' + req.params.sid + ' does not exist.')
            } else {
                res.redirect("/listStudents")
            }
        })

        .catch((error) => {
            if (error.code == "ER_ROW_IS_REFERENCED_2") {
                var errorMsg = req.params.sid + ' has associated modules he/she cannot be deleted.'

                res.render("deleteError", { error: errorMsg })

            } else {
                res.send('<h3> Error Message: <br/> ' + error.errno + " " + error.sqlMessage + ".")
            }
        })
})



app.get("/addStudent", (req, res) => {
    res.render('addStudent', { errors: undefined, errorsTwo: undefined, id: "Please Enter ID", name: "Please Enter Name", gpa: "0" })
})


app.post("/addStudent",
    [check('id').isLength({ min: 4, max: 4 }).withMessage("Student ID must be 4 characters"),
    check('name').isLength({ min: 5 }).withMessage("Name must be at least 5 characters"),
    check('gpa').isFloat({ min: 0.0, max: 4.0 }).withMessage("GPA must be between 0.0 & 4.0")],
    (req, res) => {

        var errors = validationResult(req)

        if (!errors.isEmpty()) {
            res.render("addStudent", { errors: errors.errors, errorsTwo: undefined })
        } else {
            mySQLDAO.addStudent(req.body.id, req.body.name, req.body.gpa)
                .then(() => {
                    res.redirect("/listStudents")
                })
                .catch((error) => {
                    var errorstring = ("Error:" + error.code + " " + error.sqlMessage + ".")

                    res.render("addStudent", { errors: undefined, errorsTwo: errorstring })
                })

        }

    })

//------------------------------------------Lecturers----------------------------------------------------

app.get("/listLecturers", (req, res) => {
    mongoDAO.getLecturers()
        .then((documents) => {
            res.render('showLecturers', { LecturersMethod: documents })
        })
        .catch((error) => {
            res.send(error)
        })
})

app.get("/listLecturersAlpha", (req, res) => {
    mongoDAO.getLecturersAlpha()
        .then((documents) => {
            res.render('showLecturers', { LecturersMethod: documents })
        })
        .catch((error) => {
            res.send(error)
        })
})

app.get("/listLecturersDept", (req, res) => {
    mongoDAO.getLecturersDept()
        .then((documents) => {
            res.render('showLecturers', { LecturersMethod: documents })
        })
        .catch((error) => {
            res.send(error)
        })
})

app.get("/addLecturer", (req, res) => {
    res.render('addLecturer', { errors: undefined, errorsTwo: undefined })
})


app.post("/addLecturer", [
    check('_id').isLength({ min: 4, max: 4 }).withMessage("Lecturer ID must be 4 characters"),
    check('name').isLength({ min: 5 }).withMessage("Name must be at least 5 characters"),
    check('dept').isLength({ min: 3, max: 3 }).withMessage("Dept must be 3 characters")],
    (req, res) => {

        var errors = validationResult(req)

        if (!errors.isEmpty()) {
            res.render("addLecturer", { errors: errors.errors, errorsTwo: undefined, _id: req.body.lid, name: req.body.name, dept: req.body.dept })

        } else {
            mongoDAO.findDept(req.body.dept)

                .then((result) => {
                    if (result.length == 0) {
                        var errorString = ("Dept doesn't exist")
                        res.render("addLecturer", { errors: undefined, errorsTwo: errorString, _id: req.body._id, name: req.body.name, dept: req.body.dept })
                    } else {
                        mongoDAO.addLecturer(req.body._id, req.body.name, req.body.dept)
                            .then(() => {
                                res.redirect("/listLecturers")
                            })
                            .catch((error) => {
                                if (error.message.includes("11000")) {
                                    var errorString = ("_id: " + req.body._id + " already exists")
                                    res.render("addLecturer", { errors: undefined, errorsTwo: errorString })
                                } else {
                                    var errorString = ("Error: "+error)
                                    res.render("addLecturer", { errors: undefined, errorsTwo: errorString })
                                }
                            })
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    })

//----------------------------------------------------------------------------------------------

//Server is listening to port 3000
app.listen(3000, () => {
    console.log("Application listending on port 3000")
})