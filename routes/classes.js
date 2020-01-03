const router = require('express').Router();
const Class = require('../models/class.model');
const auth = require('../middleware/auth');

router.route('/').get(auth,(req,res) =>{
    Class.find()
.then(theClass => res.json(theClass))
.catch(err => res.status(400).json('Error: '+err));
});

router.route('/:id').get(auth,(req,res) =>{
    Class.findById(req.params.id)
.then(theClass => res.json(theClass))
.catch(err => res.status(400).json('Error: '+err));
});

router.route('/:id').delete(auth,(req,res) =>{
    Class.findByIdAndDelete(req.params.id)
.then(() => res.json('Class Deleted'))
.catch(err => res.status(400).json('Error: '+err));
});


router.route('/update/:id').post(auth,(req,res) =>{
    const {  filiere,annee } = req.body;

    if( !filiere  || !annee){
        return res.status(400).json({msg : 'All fields are required'});
    }
    Class.findById(req.params.id)
    .then( theClass =>{

        theClass.filiere = filiere;
        theClass.annee = annee;

        theClass.save()
        .then(()=> res.json('theClass Updated'))
        .catch(err => res.status(400).json('Error: '+err));

    }).catch(err => res.status(400).json('Error: '+err));
});


router.route('/add').post(auth,(req,res) =>{

    const { filiere,annee } = req.body;

    if( !filiere  || !annee){
        return res.status(400).json({msg : 'All fields are required'});
    }


        const newClass= new Class();

        newClass.filiere = filiere;
        newClass.annee = annee;

        newClass.save()
        .then((theClass) => res.json(theClass))
        .catch(err => res.status(400).json('Error: '+err));




});
module.exports =  router;