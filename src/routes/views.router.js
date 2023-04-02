import {Router} from 'express'
import {cartsManager} from '../routes/carts.router.js'
import cookieParser from 'cookie-parser'
import {productsManager} from '../routes/products.router.js'
import { upload } from '../middlewares/multer.js'

// file

// mongo
//import productsManager from '../dao/mongoManager/productsManager.js'

const router = new Router()

// Vista para ser utilizada con protocalo http, layout home,
router.get('/',async(req,res) =>{
    const products = await productsManager.getProducts_()
    console.log(products)
    res.render('home',{ products, layout: "home" })
})

// Vista para ser utilizada con protocolo WebSocket, layount home
router.get('/realtimeproducts',async(req,res) =>{
    const products = await productsManager.getProducts_()
    //console.log(products)
    res.render('realTimeProducts',{ products, layout: "realTime" })
})

// Vista para ser utilizada con protocolo WebSocket, layount home
router.get('/realtimeproducts2',async(req,res) =>{
    const products = await productsManager.getProducts_()
        res.render('realTimeProducts2',{ products, layout: "altaProducto" })
})

// Vista para ser utilizada con protocolo WebSocket, layount home, implementación de un Chat
router.get('/chat',async(req,res) =>{
    //const products = await productsManager.getProducts()
        res.render('chat',{ layout: "chat" })
})

// Vista para ser utilizada para visualizar los productos paginados
router.get('/products',async(req,res) =>{

        console.log(req.query)
        const {page=1} = req.query
        const {user} = req.session
        const {sessionID} = req.sessionID
        const productsPag = await productsManager.getProducts(5, page)
        console.log(productsPag)
        //const { sessionID } = req.sessionID
        console.log('sessionID',sessionID)
        const productsPaginate = {
            user: user,
            productsPag: productsPag
        }
        //console.log(req)
       
        res.render('products',{ productsPaginate, layout: "products" })
})


// Vista para ser utilizada para visualizar los productos paginados
router.get('/productsCookies',async(req,res) =>{

    console.log(req.query)
    const {page=1} = req.query
    const {user} = req.session
   // const {user} = req.user
    console.log(req.cookie)
    const {sessionID} = req.sessionID
    const productsPag = await productsManager.getProducts(5, page)
    console.log(productsPag)
    //const { sessionID } = req.sessionID
    //console.log('sessionID',sessionID)
    
    const productsPaginate = {
        user: user,
        //email: email,
        productsPag: productsPag
    }
    //console.log(req)
    res.render('products')
    //res.render('products',{ productsPaginate, layout: "products" })
    console.log("hice el render")
})


// Vista para ser utilizada para visualizar los productos de un carrito dado
router.get('/carts/:cid',async(req,res) =>{
    
    const {cid} = req.params
    const cart = await cartsManager.getCartById(cid)
    console.log(cart)
    
    res.render('carts',{ cart, layout: "carts" })
})

// Vista para ser utilizada con protocolo WebSocket, layount home
router.get('/upfile',async(req,res,next) =>{
    //const products = await productsManager.getProducts()
        res.render('upfile',{ layout: "upfile" })
})

router.post('/upfile', upload.array('foto',2), function (req, res, next) {
    var pagina = '<!doctype html><html><head></head><body>' +
      '<p>Se subieron las fotos</p>' +
      '<br><a href="/">MENU</a></body></html>'+
      '<br><a href="/views/upfile">Subir más fotos</a></body></html>'
    res.send(pagina)
  })

router.get('/login',async(req,res)=>{
    res.render('login')
})

router.get('/registro',(req,res)=>{
    res.render('registro')
})

router.get('/errorRegistro',(req,res)=>{
    res.render('errorRegistro')
})

router.get('/errorLogin',(req,res)=>{
    res.render('errorLogin')
})

router.get('/perfil',(req,res)=>{
    res.render('perfil')
})

router.get('/jwtFront', (req, res) => {
    res.render('jwt')
  })


export default router