import { Router } from "express";
import UsersManager from "../dao/mongoManager/UsersManager.js";
import { generateToken } from "../utils.js";
import { jwtValidation } from '../middlewares/jwt.middleware.js'
import passport from 'passport'

const router = Router()
const userManager = new UsersManager()

// sin cookies
// router.post('/login',async(req,res)=>{
// //const {email,password} = req.body
// const user = await userManager.loginUser(req.body)
// if(user){
//     console.log('------');
//     const token = generateToken(user)
//     return res.json({token})
// }
// res.json({message:'Usuario no existe'})
// })

// con cookies
router.post('/login', async (req, res) => {
    //const {email,password} = req.body
    const user = await userManager.loginUser(req.body)
    if (user) {
      console.log('------')
      const token = generateToken(user)
      return res.cookie('token', token, { httpOnly: true }).json({ token })
    }
    res.json({ message: 'Usuario no existe' })
  })
  
  router.get('/login', jwtValidation, (req, res) => {
    console.log('TOKEN VALIDADO')
    res.send('PROBANDO JWT')
  })
  
  router.get('/loginJWTPassport', passport.authenticate('jwt',{session:false}), (req, res) => {
    res.send('JWT PASSPORT')
  })

  router.get('/current', passport.authenticate('current',{session:false}), (req, res) => {
    console.log(req.user)
    res.send("USER JWT COOKIES PASSPORT")
  })

  router.get('/loginJWTCookiesPassportProductos', passport.authenticate('current',{session:false}), (req, res) => {
    //console.log(req.user)
    //const email = req.user.email
    //console.log(email)
    //res.redirect(`/views/productsCookies?email=${email}`)
    //res.send("JWT cookines PASSPORT")
    //res.redirect('/views/productsCookies/?token=' + 'JWT ' + token);
    res.redirect('/views/productsCookies')
    //res.send('JWT cookines PASSPORT')
  })


  


  
export default router