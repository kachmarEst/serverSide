const mongoose =  require('mongoose');
const Schema = mongoose.Schema;
let Students = new Schema({

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
},
cne:{
    type:String,
    default:'',
    unique: true
},
filiere:{
    type:String,
    default:''
},
annee:{
    type:String,
    default:''
},
class_id:{
    type:String,
    default:''
}
},
{
    timestamps:true
});

module.exports = mongoose.model('Students',Students);