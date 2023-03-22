import { Router } from 'express'
import UsersManager from '../dao/mongoManager/UsersManager.js'
import passport from 'passport'

const router = Router()
const usersManager = new UsersManager()

// router.post('/session', (req, res) => {
//   const { username, password } = req.body
//   req.session.username = username
//   req.session.password = password
//   res.json({ message: 'Sesion iniciada con exito' })
// })

/*router.get('/logout', (req, res) => {
   req.session.destroy((error) => {
     if (error) {
       console.log(error)
       res.json({ message: error })
     } else {
       res.json({ message: 'Sesion eliminada con exito' })
     }
   })
})*/

// registro sin passport
/*router.post('/registro',async (req, res) => {
   const newUser = await usersManager.createUser(req.body)
   if (newUser) {
     res.redirect('/views/login')
   } else {
     res.redirect('/views/errorRegistro')
   }
})*/

router.get('/users', (req,res) =>{
  res.redirect('/views')
})



//registro con passport
router.post('/registro',
  passport.authenticate('registro', {
    failureRedirect: '/views/errorRegistro',
    successRedirect: '/views/products',
    passReqToCallback: true,
  })
)

//registro con passport github
router.get('/registroGithub', 
  passport.authenticate('github', { scope: [ 'user:email' ] })
)

router.get('/github', 
  passport.authenticate('github'),(req,res) =>{
    req.session.email = req.user.email
    res.redirect('/views/perfil')
  }
)

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  const user = await usersManager.loginUser(req.body)
  console.log(user)
  if (user) {
    req.session.email = email
    req.session.password = password
    req.session.user = user.first_name
    console.log('SessionID', req.sessionID)
    if(email === 'adminCoder@mail.com'){
      req.session.isAdmin = true
      res.redirect('/')
    } else {
      req.session.isAdmin = false
      res.redirect(`/views/products/`)
      //res.render('account', {user: req.session.user});
    }   
  } else {
    res.redirect('/views/errorLogin')
  }
})

router.get('/logout', (req, res) => {
  console.log('logout')
  req.session.destroy((error) => {
    if (error){
      console.log(error)
       res.json({ message: error })
    }else{
      res.redirect('/views/login')
    }
  })
})

/*router.post('/logout', (req, res, next) => {
  req.session.destroy(err => {
    if (err) return next(err)
    res.status(200).send('logged out')
  })
})*/
export default router
