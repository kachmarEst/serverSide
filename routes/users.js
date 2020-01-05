const router = require('express').Router();
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');

const key = require('../keys/config').JWTSecret;
router.route('/').get(auth,(req,res) =>{
    User.find()
    .select('-password')

.then(users => res.json(users))
.catch(err => res.status(400).json({msg:'Data Not Found'}));
});



router.route('/:id').get(auth,(req,res) =>{
    User.findById(req.params.id)
    .select('-password')

.then(user => res.json(user))
.catch(err => res.status(400).json({msg:'Data Not Found'}));
});

router.route('/:id').delete(auth,(req,res) =>{
    User.findByIdAndDelete(req.params.id)
.then(() => res.json({msg:'User Deleted'}))
.catch(err => res.status(400).json({msg:'Data Not Found'}));
});

router.route('/update/:id').post(auth,(req,res) =>{
    const {  email,username, password } = req.body;

    if(!username  || !password ||  !email){
        return res.status(400).json({msg : 'All fields are required'});
    }
    User.findById(req.params.id)
    .then( user =>{

        user.username = username;
        user.password = bcrypt.hashSync(password,bcrypt.genSaltSync(8),null);
        user.email = email;
        user.save()
        .then(()=> res.json({msg:'User Updated'}))
        .catch(err => res.status(400).json({msg:'User has not been updated '}));

    }).catch(err => res.status(400).json({msg:'User  not  found'}));
});


router.route('/add').post(auth,(req,res) =>{

    const { email,username, password } = req.body;

    if(!username  || !password  || !email){
        return res.status(400).json({msg : 'All fields are required'});
    }

    User.findOne({email})
    .then( user =>{ 
        if(user) return res.status(400).json({msg:'email Already exists'});
        User.findOne({username}).then(user => {        if(user) return res.status(400).json({msg:'username Already exists'});    })


        const newUser = new User();

     
        newUser.username =  username;
        newUser.email =  email;
        newUser.password =  newUser.generateHash(password);

        newUser.save()
        .then((user) => {
            
            jwt.sign(
                {id :user.id},
                key,
                {expiresIn: 3600},
                (err,token) => {
                    if(err) throw err;
                    res.json({
                        token,
                        user: {
                            id:user.id,
                            username: user.username,
                            email: user.email
                        }
                    });
                }
                
            )
        }).catch(err => res.status(400).json({msg : err}));

    })

});
module.exports =  router;