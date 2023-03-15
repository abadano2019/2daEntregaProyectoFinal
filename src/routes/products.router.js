//import ProductsManager from '../dao/fileManager/productsManager.js'

import ProductsManager from '../dao/mongoManager/productsManager.js'
import { Router } from "express";
import { socketServer } from '../app.js';

const router = Router();

export const productsManager = new ProductsManager()

// Busqueda de todos los productos y busqueda de productos filtrando por un limite pasado por query
router.get('/', async(req,res) => {

    const {limit} = req.query
    try{
        
        const products = await productsManager.getProducts()
        
        if(limit){
            const productSlice = products.slice(0,limit)
            res.json({message:"productos encontrado:", productSlice}) 
        }
        else{
            res.json({message:"productos encontrado:", products})
        }
    }
    catch(error){
        console.log("CODIGO GETPROD: CONTACTAR AL ADMINISTRADOR DEL SITIO")
        console.log("LOG: " + error)
    }
})

// Busqueda de productos, paginación
router.get('/paginate', async(req,res) => {

    try{
        const {limit=10, page=1, sort, ...query} = req.query
        
        const products = await productsManager.getProducts(limit,page,query,sort)
        
        res.json({message:"productos encontrado:", products})

    }
    catch(error){
        console.log("CODIGO GETPROD: CONTACTAR AL ADMINISTRADOR DEL SITIO")
        console.log("LOG: " + error)
    }
})

// Busqueda de producto por id
router.get('/:idProduct', async(req,res) => {

    try{
        const {idProduct} = req.params
        const product = await productsManager.getProductById(idProduct)
        
        if(product){
            res.json({mesage:'Producto encontrado',product})
        } else {
            res.json({mesage:'Producto no encontrado'})
        }
    }
    catch(error){
        console.log("CODIGO GETPRODID: CONTACTAR AL ADMINISTRADOR DEL SITIO")
        console.log("LOG: " + error)
    }
})

// alta de producto
router.post('/',async(req,res) => {

    console.log('multer',req.file)
    
    try{
        const {title, description, price,thumbnails,code,stock, status,category } = req.body   
        const validation = productsManager.dataTypeValidation(title, description, price,thumbnails,code,stock, status,category )
        if (validation === "ok"){  
               
            const product = productsManager.createProduct(title,description,price,thumbnails,code,stock,status, category)
            
            if(typeof(product) === 'string')
            {
                res.json({mensaje: product})
                return "Validation product: " + product
            }
            const cod = await productsManager.addProduct(product)
            console.log("codigo", cod)
            if (cod === "ADDPROD-COD1"){
                res.json({mesage:'ATENCION: Verifique el campo Code, el mismo ya existe en otro producto'})    
            }
            else{
                if (cod === "ADDPROD-COD2" ){
                        const products = await productsManager.getProducts()
                        console.log(products)
                        socketServer.emit("productoAgregado",{products})
                        res.json({mesage:'Producto agregado',product})
                }
                
            }
        }else{
            res.json({mesage:'Error: ', validation})
        }

    }
    
    catch(error){
        console.log("CODIGO ADDPROD: CONTACTAR AL ADMINISTRADOR DEL SITIO")
        console.log("LOG: " + error)
        res.json({mesage: error})
    }
})

// modificación de producto
router.put('/:idProduct', async(req,res) => {

    try{
       
        const {idProduct} = req.params
        const {title, description, price,thumbnail,code,stock, status, category } = req.body   

        const dataCheck = productsManager.dataTypeValidationUpdate(title, description, price,thumbnail,code,stock, status, category )
        if(dataCheck !== "OK"){
            res.json({mesage: dataCheck})
        }

        const product = productsManager.createProductPut(title,description,price,thumbnail,code,stock,status,category)
        const modifyProduct = await productsManager.getProductById(idProduct)
        if (modifyProduct){
            const validation = await productsManager.updateProduct(idProduct, product)
            if (validation ==='OK'){
                res.json({mesage:'Producto modificado'})
            }else{
                res.json({mesage: validation})
            }
        }
        else
        {
            res.json({mesage:'No existe el producto a modificar'})
        }   
    }
    catch(error){
        console.log("CODIGO PUTPROD: CONTACTAR AL ADMINISTRADOR DEL SITIO")
        console.log("LOG: " + error)
    }    
})

// eliminación de producto
router.delete('/:idProduct', async(req,res) => {

    const {idProduct} = req.params
        
    try{
        const {idProduct} = req.params
        const product = await productsManager.getProductById(idProduct)
        
        if(product){
            productsManager.deleteProduct(idProduct)
            const products = await productsManager.getProducts()
            socketServer.emit("productoEliminado",{products})
            res.json({mesage:'Producto eliminado',product})
        } else {
            res.json({mesage:'Producto no encontrado'})
        }
    }
    catch(error){
        console.log("CODIGO DELPROD: CONTACTAR AL ADMINISTRADOR DEL SITIO")
        console.log("LOG: " + error)
    }
    
})




export default router