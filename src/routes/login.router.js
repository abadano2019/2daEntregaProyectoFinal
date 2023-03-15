import { Router } from "express";

const router = Router();

/*router.get('/',(req,res)=>{
    res.render('login',{layout: "login"})
})

router.post('/',(req,res)=>{
    const {nombre, email} = req.body
    console.log(nombre)
    console.log(email)
    
})

router.get('/login_session',(req,res)=>{
    res.render('session',{layout: "login"})
})

router.post('/session',(req,res)=>{
    const {user, password} = req.body
    console.log(user)
    console.log(password)
    req.session['user'] = user
    req.session['password'] = password
    
    
})*/

export default router