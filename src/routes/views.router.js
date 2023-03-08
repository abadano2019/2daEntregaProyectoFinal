import {Router} from 'express'
import {cartsManager} from '../routes/carts.router.js'
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
        const {page=1} = req.query
        const productsPaginate = await productsManager.getProducts(5, page)
       
        res.render('products',{ productsPaginate, layout: "products" })
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


export default router