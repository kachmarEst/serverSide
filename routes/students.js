const router = require('express').Router();
const Student = require('../models/student.model');
const Class = require('../models/class.model');
const auth = require('../middleware/auth');

router.route('/').get(auth,(req,res) =>{
    Student.find()
.then(st => {
    
        Class.find()
        .then((cl) =>   res.json({students:st,classes:cl}) )
        .catch(err => res.status(400).json({msg:'Data Not Found'}));
})
.catch(err => res.status(400).json({msg:'Data Not Found'}));
});

router.route('/:id').get(auth,(req,res) =>{
    Student.findById(req.params.id)
.then(student =>{ 
        Class.findById(student.class_id)
        .then((clas) =>   res.json({students:student,classes:clas}) )
        .catch(err => res.status(400).json({msg:'Data Not Found'}));
      

})
.catch(err => res.status(400).json({msg:'Data Not Found'}));
});

router.route('/:id').delete(auth,(req,res) =>{
    Student.findByIdAndDelete(req.params.id)
.then(() => res.json('Student Deleted'))
.catch(err => res.status(400).json({msg:'Data Not Found'}));
});


router.route('/update/:id').post(auth,(req,res) =>{
    const {  firstName,lastName,cin,cne,class_id} = req.body;

    if(!cne  || !class_id || !firstName || !lastName || !cin){
        return res.status(400).json({msg : 'All fields are required'});
    }
 

    Student.findById(req.params.id)
    .then( student =>{

        student.cne = cne;
        student.class_id = class_id;
        student.firstName = firstName;
        student.lastName = lastName;
        student.cin = cin;
      
        student.save()
        .then(()=> res.json('Student Updated'))
        .catch(err => res.status(400).json({msg:'Data Not Found'}));


    }).catch(err => res.status(400).json({msg:'Data Not Found'}));

});


router.route('/add').post(auth,(req,res) =>{

    const {  firstName,lastName,cin,cne,class_id } = req.body;

    if(!cne  || !class_id || !firstName || !lastName || !cin){
        return res.status(400).json({msg : 'All fields are required'});
    }

    Student.findOne({cin})
    .then( student =>{
        if(student) return res.status(400).json({msg:' cin Already exists'});
        Student.findOne({cne}) .then( st =>{        if(st) return res.status(400).json({msg:' cne Already exists'});});


        const newStudent= new Student();

        newStudent.cne = cne;
        newStudent.class_id = class_id;
        newStudent.firstName = firstName;
        newStudent.lastName = lastName;
        newStudent.cin = cin;
  

        newStudent.save()
        .then((student) => res.json(student))
        .catch(err => res.status(400).json({msg:'Data Not Found'}));


    })

});
module.exports =  router;