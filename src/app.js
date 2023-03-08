// Desafio entregable Nro 5, Programación Backend
// Tema: WebSocket
// Titular: Ariel Badano
// CoderHouse
// Servidor express

import './dao/dbConfig.js'

import MessagesManager from '../src/dao/mongoManager/messagesManager.js'
import { Server } from 'socket.io'
import { __dirname } from '../src/utils.js'
import cartsRouters from './routes/carts.router.js'
import express from 'express'
import handlebars from 'express-handlebars'
import {productsManager} from '../src/routes/products.router.js'
import productsRouters from '../src/routes/products.router.js'
import viewsRouter from './routes/views.router.js'

const PORT = 3000
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/api/products',productsRouters)
app.use('/api/carts',cartsRouters)
app.use('/views', viewsRouter)

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