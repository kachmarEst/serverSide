const router = require('express').Router();
const Prof = require('../models/prof.model');
const Element = require('../models/element.model');

const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');
const key = require('../keys/config').JWTSecret;

router.route('/').get(auth,(req,res) =>{
    Prof.find()
.then(profs => res.json(profs))
.catch(err => res.status(400).json('Error: '+err));
});

router.route('/:id').get(auth,(req,res) =>{
    Prof.findById(req.params.id)
.then(prof => res.json(prof))
.catch(err => res.status(400).json('Error: '+err));
});

router.route('/:id').delete(auth,(req,res) =>{
    Prof.findByIdAndDelete(req.params.id)
.then(() =>{ 
    
    Element.deleteMany({prof_id:req.params.id}).then(
        () => res.json('Prof Deleted')
    )
       })

.catch(err => res.status(400).json('Error: '+err));
});

router.route('/update/:id').post(auth,(req,res) =>{
    const {  email,username, password,firstName,lastName,cin } = req.body;

    if(!username  || !password || !firstName || !lastName || !cin  || !email){
        return res.status(400).json({msg : 'All fields are required'});
    }
    Prof.findById(req.params.id)
    .then( prof =>{

        prof.username = username;
        prof.password = bcrypt.hashSync(password,bcrypt.genSaltSync(8),null);
        prof.email = email;
        prof.firstName = firstName;
        prof.lastName = lastName;
        prof.cin = cin;
        prof.save()
        .then(()=> res.json('Prof Updated'))
        .catch(err => res.status(400).json('Error: '+err));

    }).catch(err => res.status(400).json('Error: '+err));
});


router.route('/add').post(auth,(req,res) =>{

    const {  email,username, password,firstName,lastName,cin } = req.body;

    if(!username  || !password || !firstName || !lastName || !cin   || !email){
        return res.status(400).json({msg : 'All fields are required'});
    }

    Prof.findOne({email})
    .then( user =>{
        if(user) return res.status(400).json({msg:'Already exists'});
        const newProf = new Prof();

     
        newProf.username =  username;
        newProf.email =  email;
        newProf.password =  newProf.generateHash(password);
    newProf.firstName = firstName;
        newProf.lastName = lastName;
        newProf.cin = cin;
        newProf.save()
        .then((prof) => {
            
            jwt.sign(
                {id :prof.id},
                key,
                {expiresIn: 3600},
                (err,token) => {
                    if(err) throw err;
                    res.json({
                        token,
                        prof: {
                            id:prof.id,
                            username: prof.username,
                            email: prof.email
                        }
                    });
                }
                
            )
        });

    })

});
module.exports =  router;