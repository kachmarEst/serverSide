const mongoose =  require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
let Profs = new Schema({
password:{
    type:String,
    default:''
},
email:{
    type:String,
    unique: true,
    trim:true
},
username:{
    type:String,
    required:true,
    unique: true,
    trim:true
},
firstName:{
    type:String,
    default:''
},
lastName:{
    type:String,
    default:''
},
cin:{
    type:String,
    default:'',
    unique: true

}
},
{
    timestamps:true
});

Profs.methods.generateHash = function(password){
    return bcrypt.hashSync(password,bcrypt.genSaltSync(8),null);
}
Profs.methods.validPassword = function(password){
    return bcrypt.compareSync(password,this.password);
}
module.exports = mongoose.model('Profs',Profs);