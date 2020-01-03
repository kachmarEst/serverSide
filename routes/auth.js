const router = require('express').Router();
const User = require('../models/user.model');
const Prof = require('../models/prof.model');

const jwt = require('jsonwebtoken');
const key = require('../keys/config').JWTSecret;
const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');


router.route('/profs').post((req,res) =>{
    const{username,password} = req.body;
    if(!username || !password){
        return res.status(400).json({msg : 'All fields are required'});
    }
    Prof.findOne({username})
    .then(prof =>{
        if(!prof) return res.status(400).json({msg :  'Doesnt exist'});

        bcrypt.compare(password,prof.password)
        .then(isMatch => {
            if(!isMatch) return res.status(400).json({msg: 'Invalid '});
             jwt.sign(
                 {id: prof.id},
                 key,
                 {expiresIn:3600},
                 (err,token) => {
                     if(err) throw err;
                     res.json({
                         token,
                         prof:{
                             id:prof.id,
                             username:prof.username,
                             email:prof.email
                         }
                     });
                 }
             )
        })
    })


});


router.route('/admin').post((req,res) =>{
    const{username,password} = req.body;
    if(!username || !password){
        return res.status(400).json({msg : 'All fields are required'});
    }
    User.findOne({username})
    .then(user =>{
        if(!user) return res.status(400).json({msg :  'Doesnt exist'});

        bcrypt.compare(password,user.password)
        .then(isMatch => {
            if(!isMatch) return res.status(400).json({msg: 'Invalid '});
             jwt.sign(
                 {id: user.id},
                 key,
                 {expiresIn:3600},
                 (err,token) => {
                     if(err) throw err;
                     res.json({
                         token,
                         user:{
                             id:user.id,
                             username:user.username,
                             email:user.email
                         }
                     });
                 }
             )
        })
    })


});

router.route('/user').get(auth,(req,res) =>{
User.findById(req.user.id)
.select('-password')
.then(user => res.json(user));
});



router.route('/check').get((req,res) =>{
 
    const token = req.header('x-auth-token');

    if(!token) return res.status(401).json({msg:'UNAUTHORIZED REQUEST'});

        try{
            const decoded = jwt.verify(token,key);
           return res.status(200).json({msg:'Authorized Request',user:decoded})
        }catch(e){
            res.status(400).json({msg:'Token Unvalid'});
        }

    });
    


router.route('/prof').get(auth,(req,res) =>{
    Prof.findById(req.prof.id)
    .select('-password')
    .then(prof => res.json(prof));
    });
    

module.exports = router;


