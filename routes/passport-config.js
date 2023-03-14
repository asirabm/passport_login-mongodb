const localSrategy=require('passport-local').Strategy
const bcrypt=require('bcrypt')

function initializer(passport,getUserByEmail,getUserById){

    const authenticateUser= async(email,password,done)=>{
        const user=await getUserByEmail(email)
        if(user==null){
          return done(null,false,{message:'No user with that email'})
        }
        try{
            //console.log(password)
            //console.log(user.password)
            const a=await bcrypt.compare(password,user.password)
            //console.log(a)
         if(await bcrypt.compare(password,user.password) ){
           return done(null,user)
         }
         else{
            console.log('Password wrong')
            return done(null,false,{message:'Password incroeect'})
         }
        }
        catch(e){
            return done(e)
        }

    }

    passport.use(new localSrategy({
        usernameField:'email'
    },authenticateUser))
    passport.serializeUser((user,done)=>done(null,user.id))

    passport.deserializeUser(async(id,done)=>{
       // console.log(id)
        const user1=await getUserById(id) 
        return done(null,user1)
    })
}


 module.exports=initializer