const express=require('express')
const router=express.Router()
const User=require('../db/model/user')
const bcrypt=require('bcrypt')
const passport=require('passport')
const initializer=require('./passport-config')
const flash=require('express-flash')
const session=require('express-session')
const method_override=require('method-override')
router.use(method_override('_method'))
/*
initializer(passport,async(email)=>{
const user= await User.findOne({email:email})
return user
},
async(id)=>{
  const user=await User.findById(id)
 // console.log(`Hi ${user}`)
  return user
}
)

router.use(flash())
router.use(session({
  secret:'seacret',
  resave:false,
  saveUninitialized:false,
  
}))
router.use(passport.initialize())
router.use(passport.session())
*/
router.get('/',CheckAutheicate,(req,res)=>{
  //console.log(req.user)
  res.render('home',{name: req.user.name})
})

router.get('/login',CheckNotAutheicate,(req,res)=>{
  res.render('login')
})
router.get('/register',CheckNotAutheicate,(req,res)=>{
    res.render('register',{message:null})
})
router.post('/loginuser',CheckNotAutheicate,passport.authenticate('local',{
    successRedirect:'/user/',
    failureRedirect:'/user/login',
    failureFlash:true
    
}))

router.post('/logout',(req,res,next)=>{
  console.log('Helooo')
  req.logOut((err)=>{
    if(err){
     return next(err)
    }
    else{
      res.redirect('/user/login')
    }
  })
 
})

router.post('/registeruser',CheckNotAutheicate,async(req,res)=>{
  
  try{
  const email=req.body.email
  const name=req.body.name
  const hashpassword=await bcrypt.hash(req.body.password,10)
  const u1=new User({
    name:name,
    email:email,
    password:hashpassword
  })
  await u1.save()
  console.log('user registered sucessfully')
  res.redirect('/user/login')
}
catch(e){
  let message
  console.log(e.name)
  if(e.name==='MongoServerError'){
   message='Email alredy exist,choose another email'
  }
  else{
    message='Invalid email'
  }
  res.render('register',{message:message})
}
})

function CheckAutheicate(req,res,next){
   if(req.isAuthenticated()){
      next()
   }
   else{
    res.redirect('/user/login')
   }
}
function CheckNotAutheicate(req,res,next){
 // console.log(req)
  if(req.isAuthenticated()){
     res.redirect('/user/')
  }
  else{
   next()
  }
}


module.exports=router