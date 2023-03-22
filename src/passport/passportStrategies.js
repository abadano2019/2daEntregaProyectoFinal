import {Strategy as GithubStrategy} from 'passport-github2'
import {Strategy as LocalStrategy} from 'passport-local'
import { hashPassword } from '../utils.js'
import passport from "passport";
import {userModel} from '../dao/models/users.model.js'

passport.use(
    'registro',
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true,
      },
      async (req, email, password, done) => {
        const user = await userModel.findOne({email})
        let rolUser = 'usuario'
        if (user) {
          return done(null, false)
        }
        if(email === "adminCoder@coder.com"){
          rolUser = "admin"
        }
        const hashNewPassword = await hashPassword(password)
        const newUser = { ...req.body, password: hashNewPassword, rol: rolUser }
        const newuserDB = await userModel.create(newUser)
        done(null, newuserDB)
      }
    )
  )

passport.use(
    'github',
    new GithubStrategy(
      {
        clientID: 'Iv1.a7af5df0984711e2',
        clientSecret: '6c11895d4d41cf05134d53dcfbacb0e98e84c72a',
        callbackURL: 'http://localhost:3000/users/github',
      },
      async (accessToken, refreshToken, profile, done) => {
        
        const user = await userModel.findOne({email: profile._json.email})
        if (!user) {
            const newUser = {
                first_name: profile._json.name.split(' ')[0],
                last_name: profile._json.name.split(' ')[1] || ' ',
                email: profile._json.email,
                password:"github",
            }
            const newuserDB = await userModel.create(newUser)
            done(null,newuserDB)
        }
        else 
        {
            done(null, user)
        }
      }
    )
)

passport.serializeUser((user, done) => {
    console.log(user);
  done(null, user._id)
})

passport.deserializeUser(async (id, done) => {
  const user = await userModel.findById(id)
  done(null, user)
})
