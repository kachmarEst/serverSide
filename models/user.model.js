const mongoose =  require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
let Users = new Schema({
password:{
    type:String,
    default:''
},
email:{
    type:String,
    required:true,
    unique: true,
    trim:true
},
username:{
    type:String,
    required:true,
    unique: true,
    trim:true
}
},
{
    timestamps:true
});

Users.methods.generateHash = function(password){
    return bcrypt.hashSync(password,bcrypt.genSaltSync(8),null);
}
Users.methods.validPassword = function(password){
    return bcrypt.compareSync(password,this.password);
}
module.exports = mongoose.model('Users',Users);