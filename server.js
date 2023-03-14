const express=require('express')
const app=express()
const flash=require('express-flash')
const session=require('express-session')
const emp=require('./routes/logreg')
const mongoose=require('mongoose')
app.use(express.urlencoded({extended:false}))
const initializer=require('./routes/passport-config')
const passport=require('passport')

app.set('view engine','ejs')
const User=require('./db/model/user')

app.use(flash())
app.use(session({
  secret:'seacret',
  resave:false,
  saveUninitialized:false,
  
}))
app.use(passport.initialize())
app.use(passport.session())




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

function CheckNotAutheicate(req,res,next){
      if(req.isAuthenticated()){
         res.redirect('/user/')
      }
      else{
       next()
      }
    }


app.get('/',CheckNotAutheicate,(req,res)=>{
    res.render('index')
})

app.use('/user',emp)
mongoose.connect('mongodb://127.0.0.1/passportlogin')
.then(()=>console.log('conncetion establoshed sucessfully'))
.catch(e=>console.log(e.message))

app.listen(4000)

  