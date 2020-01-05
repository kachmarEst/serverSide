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
class_id:{
    type:String,
    default:''
}
},
{
    timestamps:true
});

module.exports = mongoose.model('Students',Students);