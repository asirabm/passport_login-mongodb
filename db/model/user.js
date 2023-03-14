const mongoose=require('mongoose')
const validator=require('validator')
userSchema=mongoose.Schema({
    name:String,
    email:{
     type:String,
     required:true,
     unique:true,
     validate:(v)=>validator.isEmail(v),
     lowercase:true
    },
    password:String
})
module.exports=mongoose.model('user',userSchema)