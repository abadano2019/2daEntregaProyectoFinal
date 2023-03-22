// Desafio entregable Nro 5, Programación Backend
// Tema: WebSocket
// Titular: Ariel Badano
// CoderHouse
// Servidor express

import './dao/dbConfig.js'
import './passport/passportStrategies.js'

import FileStore from 'session-file-store'
import MessagesManager from '../src/dao/mongoManager/messagesManager.js'
import { Server } from 'socket.io'
import { __dirname } from '../src/utils.js'
import cartsRouters from './routes/carts.router.js'
import cookieParser from 'cookie-parser'
import express from 'express'
import handlebars from 'express-handlebars'
import mongoStore from 'connect-mongo'
import passport from 'passport'
import {productsManager} from '../src/routes/products.router.js'
import productsRouters from '../src/routes/products.router.js'
import session from 'express-session'
import usersRouter from './routes/users.router.js'
import viewsRouter from './routes/views.router.js'

const PORT = 3000
const app = express()
const cookieKey = "signedCookieKey"
//const fileStore = FileStore(session)
app.use(cookieParser(cookieKey))
/*app.use(session({
    secret:"secretCoder23",
    resave:false,
    saveUninitialized: true,
    cookies:{maxAge:50000}
    store: new fileStore({path: __dirname+'/sessions'}),
    //cookie:{maxAge:50000}
}))*/
app.use(session({
    secret:"secretCoder23",
    resave:false,
    saveUninitialized: false,
    cookies:{maxAge:500000},
    store: new mongoStore({
        mongoUrl: 'mongodb+srv://abadano05:coderhouse@cluster0.c3jlm8v.mongodb.net/ecommerce?retryWrites=true&w=majority'}),
    //cookie:{maxAge:50000}
}))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/api/products',productsRouters)
app.use('/api/carts',cartsRouters)
app.use('/views', viewsRouter)
app.use('/users', usersRouter)

// passport
//inicializar passport
app.use(passport.initialize())
// passport va a guardar la informacion de session
app.use(passport.session())

// archivos estaticos
app.use(express.static(__dirname + '/public'))

// handlebars
app.engine('handlebars', handlebars.engine())
app.set('view engine', 'handlebars')
app.set('views', __dirname+'/views')

const httpServer = app.listen(PORT,()=>{
    console.log('******* Ejecutando servidor *******')
    console.log(`*** Escuchando al puerto:  ${PORT} ***`)
})

// cookie
app.get('/addCookieMaxAge',(req,res)=>{
    res.cookie("PrimeraCookie", "mi primera cookie",{maxAge:5000}).send("cookie generada con existo")
})

app.get('/addCookie',(req,res)=>{
    res.cookie("PrimeraCookie", "mi primera cookie").send("cookie generada con existo")
})

app.get('/addSignedCookie',(req,res)=>{
    res.cookie("PrimeraCookieFirmada", "mi primera cookie Firmada",{signed:true}).send("cookie firmada generada con existo")
})

app.get('/getCookies', (req,res)=>{
    console.log(req.cookies)
    const {PrimeraCookie} = req.cookies
    const {PrimeraCookieFirmada} = req.signedCookies
    res.json({cookie: PrimeraCookie, signedCookies: PrimeraCookieFirmada})
})

app.get('/getCookies', (req,res)=>{
    console.log(req.cookies)
    const {PrimeraCookie} = req.cookies
    res.json({cookie: PrimeraCookie})
})

app.get('/delCookie', (req,res)=>{
    res.clearCookie("PrimeraCookie").send("Cookie borrada con existo")
})

app.get('/modCookie', (req,res) =>{
    res.cookie("PrimeraCookie", "mi primera cookie modificada").send("cookie modificada con exito")
})



export const socketServer = new Server(httpServer)
const infoMensajes = []
const messagesManager = new MessagesManager()
socketServer.on('connection',(socket)=>{
    console.log(`Usuario conectado ${socket.id}`)

    socket.on('disconnect',()=>{
        console.log('Uusario desconectado');
    })

    socket.on('addProduct', async({title, description, price, code,stock,status,category})=>{
        
        try{
            const thumbnails = []   
            const validation = productsManager.dataTypeValidation(title, description, parseInt(price),thumbnails,code,parseInt(stock), Boolean(status),category )
            if (validation === "ok"){        
                const product = productsManager.createProduct(title,description,price,thumbnails,code,stock,status, category)
                if(typeof(product) === 'string')
                {
                    return "Validation product: " + product
                }
                const cod = await productsManager.addProduct(product)
                
                if (cod === "ADDPROD-COD1"){
                    console.log({mesage:'ATENCION: Verifique el campo Code, el mismo ya existe en otro producto'})    
                }
                else{
                    
                    const products = await productsManager.getProducts()
                    socketServer.emit("productoAgregado",{products})
                    console.log({mesage:'Producto agregado',product})
                }
            }else{
                console.log({mesage:'Error: ', validation})
            }
        }
        catch(error){
            console.log("CODIGO ADDPROD-SERV: CONTACTAR AL ADMINISTRADOR DEL SITIO")
            console.log("LOG: " + error)
        }
    })

    socket.on('nuevoUsuario',usuario=>{
        socket.broadcast.emit('broadcast',usuario)
    })

    socket.on('mensaje',async info=>{
        const message = messagesManager.createMensaje(info.user, info.message)
        messagesManager.addMessage(message)
        const chats = await messagesManager.getMessages()
        socketServer.emit('chat',chats)
    })

    socket.on('nextPage',async info=>{
        console.log("Recibo Next")
        /*const products = productsManager.createMensaje(info.user, info.message)
        messagesManager.addMessage(message)
        const chats = await messagesManager.getMessages()
        socketServer.emit('chat',chats)*/
    })

})