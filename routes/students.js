const router = require('express').Router();
const Student = require('../models/student.model');
const auth = require('../middleware/auth');

router.route('/').get(auth,(req,res) =>{
    Student.find()
.then(students => res.json(students))
.catch(err => res.status(400).json('Error: '+err));
});

router.route('/:id').get(auth,(req,res) =>{
    Student.findById(req.params.id)
.then(student => res.json(student))
.catch(err => res.status(400).json('Error: '+err));
});

router.route('/:id').delete(auth,(req,res) =>{
    Student.findByIdAndDelete(req.params.id)
.then(() => res.json('Student Deleted'))
.catch(err => res.status(400).json('Error: '+err));
});


router.route('/update/:id').post(auth,(req,res) =>{
    const {  firstName,lastName,cin,cne,class_id,filiere,annee } = req.body;

    if(!cne  || !class_id || !firstName || !lastName || !cin || !filiere  || !annee){
        return res.status(400).json({msg : 'All fields are required'});
    }
    Student.findById(req.params.id)
    .then( student =>{

        student.cne = cne;
        student.class_id = class_id;
        student.firstName = firstName;
        student.lastName = lastName;
        student.cin = cin;
        student.filiere = filiere;
        student.annee = annee;

        student.save()
        .then(()=> res.json('Student Updated'))
        .catch(err => res.status(400).json('Error: '+err));

    }).catch(err => res.status(400).json('Error: '+err));
});


router.route('/add').post(auth,(req,res) =>{

    const {  firstName,lastName,cin,cne,class_id,filiere,annee } = req.body;

    if(!cne  || !class_id || !firstName || !lastName || !cin || !filiere  || !annee){
        return res.status(400).json({msg : 'All fields are required'});
    }

    Student.findOne({cin})
    .then( student =>{
        if(student) return res.status(400).json({msg:'Already exists'});
        const newStudent= new Student();

        newStudent.cne = cne;
        newStudent.class_id = class_id;
        newStudent.firstName = firstName;
        newStudent.lastName = lastName;
        newStudent.cin = cin;
        newStudent.filiere = filiere;
        newStudent.annee = annee;

        newStudent.save()
        .then((student) => res.json(student))
        .catch(err => res.status(400).json('Error: '+err));


    })

});
module.exports =  router;