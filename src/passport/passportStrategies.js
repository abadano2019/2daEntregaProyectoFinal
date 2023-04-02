import { ExtractJwt, Strategy as jwtStrategy } from 'passport-jwt'

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
        let rolUser = 'user'
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
        let role = "user"
        if (profile._json.email === "adminCoder@coder.com"){
          role = "admin"
        }
        if (!user) {
            const newUser = {
                first_name: profile._json.name.split(' ')[0],
                last_name: profile._json.name.split(' ')[1] || ' ',
                email: profile._json.email,
                password:"github",
                role: role,
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

///////////////////////////////////////////////////////////////////////////
// jwt Strategy
passport.use(
  'jwt',
  new jwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'secretJWT',
    },
    async (jwt_payload, done) => {
      done(null, jwt_payload.user)
    }
  )
)

// jwt Strategy con cookies

const cookieExtractor = (req)=>{
  const token = req.cookies.token
  return token
}

passport.use(
  'current',
  new jwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      secretOrKey: 'secretJWT',
    },
    async (jwt_payload, done) => {
      done(null, jwt_payload.user)
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
