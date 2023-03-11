// Desafio entregable Nro 4, Programación Backend
// Tema: Primera preentrega
// Titular: Ariel Badano
// CoderHouse

// Manejador de carritos

import CartProducts from '../../js/cartProduct.js'
import { cartsModel } from '../models/carts.model.js'
import {mongoose} from "mongoose"
import { productsModel } from '../models/products.model.js'

export default class CartsManager {

  // Metodo que devuelve la colección de carritos almacenada en el archivo que se encuentra en la dirección
  // guardada en el atributo path de la clase. En caso de que el archivo aún no se haya creado devuelve un 
  // arreglo vacio.
  async getCarts() {
    try{
        const cartsBD = await cartsModel.find()
        return cartsBD
      }
      catch(error){
        console.log("GetCarts", error)
      }
  }

  // Metodo que devuelve un carrito dado por un id de carrito, en caso de no existir en la colección el metodo
  // devuelve un mensaje "Error: Not Found" en caso contrario devuelve un mensaje con el id, el titulo y la
  // descripción por la consola además de devolver el objeto del carrito encontrado.
  async getCartById(idCart) {
    mongoose.set('strictQuery', false);
    const cart = await cartsModel.findById(idCart).lean()
    //const cart = await cartsModel.findOne({_id: idCart}).populate({ path: 'cartProducts.id'}).lean()
    console.log(cart)
    if (!cart)
    {
      console.log("Error: Not Found")
    }
    else
    {
      console.log("Carrito encontrado: " + 
                  "id: " + cart.id + 
                  " productos: " + cart.cartProducts)
      return cart
    }
  }


  // Metodo que crea un producto de carrito con la variable idProducto
  // se valida la no duplicación del campo code con productos ya ingresados a la colección, además de que los
  // campos ingresado existan y no sean vacios. En caso de cumplirse todos los anteriores supuestos el metodo 
  // devuelte una instancia del objete Producto.
  createCartProduct(pid){
    // crear cart 
    const cartProduct = new CartProducts(pid)
    return cartProduct

  }

  // Método para crear un carrito
  createCart(){
    
    // crear cart
    const cart = {
        cartProducts: []
    }
    return cart
  }

  // Metodo que agrega un carrito a la colección de carritos almacenada en el archivo ubicado en la dirección 
  // almacenada en el atributo path de la clase. El metodo recibe una instancia del objeto cart.
  async addCart(cart) {

      try{
          const newCart = await cartsModel.create(cart)
          console.log("Carrito agregado")
          
      }catch (error) {
        console.log("Error en ADDCART", error)
      }
        
  }

  /*async addProductCart__(cid, pid) {

    try {
        //     const cart = await cartsModel.findOneAndUpdate({_id: cid}, {$push: {id: pid}},  { upsert: true })

        // console.log(cart)
        const cart = await cartsModel.findOne({ _id: cid })
        //  console.log('aca', cart)
        if (!cart) return console.log('carrito no encontrado')

        console.log('here', cart.cartProducts.findIndex(el => el.id == pid))

        if (cart.cartProducts.findIndex(el => el.id == pid) !== -1) {
            cart.cartProducts[cart.cartProducts.findIndex(el => el.id == pid)].quantity += 1
            console.log('nuevo', cart)
        } else {
            cart.cartProducts.push({ id: pid, quantity: 1 })
        }

        await cart.save()

        return cart
    } catch (error) {
        console.log(error)
        return error
    }
}*/

  // Metodo para agregar un producto de carrito a un carrito
  async addProductCart(cid,pid){
    try{
      
      const objectPid = mongoose.Types.ObjectId(pid);

      let cart = await cartsModel.findById(cid)
      console.log(cart)
      let newCartProducts = []
      if(!cart){
        console.log("carrito no encontrado")
        return
      }

      if(cart?.cartProducts.length === 0){
        console.log("llegue")
        //const product = this.createCartProduct(objectPid)
        //newCartProducts.push(product)
        //newCartProducts.push({id:objectPid, quantity:1})
        cart.cartProducts.push({id:pid,quantity:1})
        console.log("sali de llegue")
      } 
      else{
        const pidStirng = pid.toString()
        console.log("ObjectID", objectPid)
        let cartProduct = cart.cartProducts.find((product) => product.id._id.toString() === pid) 
        
        cart.cartProducts.forEach(element => {
          console.log("----------------------------")
          console.log(element.id._id.toString())
          console.log("----------------------------")
          
        });
          
        
        if(!cartProduct){
          console.log("carrito encontrado antes de es este")
          console.log(pid)
          console.log("ObjectID", objectPid)
          //const product = this.createCartProduct(objectPid)
          //newCartProducts = [...cart.cartProducts, product]
          cart.cartProducts.push({id:pid,quantity:1})
        }
        else{
          cartProduct.quantity = cartProduct.quantity + 1
          console.log("es este?")
          //newCartProducts = cart.cartProducts
          console.log("es este2?")    
        }
      }
      
      console.log("CArt Products",cart.cartProducts)
      console.log(cid)
      //const filter = {id: cid}
      //const datos = {cartProducts: newCartProducts}
      
      await cart.save()
      console.log("carrito actualizado")
      
      //const newCart = await cartsModel.findByIdAndUpdate(cid, {cartProducts: cart.cartProducts}, {new:true})
      //console.log("Nuevo cart",newCart)
      
    }catch(error){
      console.log(error)
    }
  }
        
  // Metodo que elimina un carrito de la colección de carritos almacenada en el archivo ubicado
  // en la dirección del atributo path de la clase, recibe el id del producto a ser eliminado. 
  async deleteCart(idCart){

    if (!idCart){
      console.log("ATENCION: Debe ingresar un id valido")
      return
    }

    const cartEncontrado = await cartsModel.findById(idCart)
    if(!cartEncontrado) { 
      console.log("No existe carrito con el id: " + idCart)
      return 
    }
    
    try{
      const cart = await cartsModel.findByIdAndRemove(idCart)
      if(cart){
        console.log("Carrito eliminado")
      }
    }
    catch(error) {
      console.log("ERROR EN DELETECART",error)
    }  

  }

  // Metodo para borrar un producto dado por parametro del carrito de compra
async deleteProductCart(cid,pid){
  try{
    
    let cart = await cartsModel.findById(cid)
    console.log(cart)
    let newCartProducts = []
    if(!cart){
      console.log("carrito no encontrado")
      return
    }

    if(cart?.cartProducts.length === 0){
      console.log("Carrito sin productos")
    } 
    else{
      let cartProduct = cart.cartProducts.find((product) => product.id._id.toString() === pid) 
      if(!cartProduct){
        console.log("no existe producto a borrar en el carrito")
      }
      else{
        let filteredProducts = cart.cartProducts.filter((product) => product.id._id.toString() !== pid) 
        newCartProducts = filteredProducts
      }
    }
    
    console.log("Cart Products",newCartProducts)
    console.log(cid)
    //const filter = {id: cid}
    //const datos = {cartProducts: newCartProducts}
    const newCart = await cartsModel.findByIdAndUpdate(cid, {cartProducts: newCartProducts}, {new:true})
    console.log("Nuevo cart",newCart)
    
  }catch(error){
    console.log(error)
  }
}


// Metodo para borrar un producto dado por parametro del carrito de compra
async deleteProductsCart(cid){
  try{
    
    let cart = await cartsModel.findById(cid)
    console.log(cart)
    let newCartProducts = []
    if(!cart){
      console.log("carrito no encontrado")
      return
    }

    if(cart.cartProducts.length === 0){
      console.log("Carrito sin productos")
      return "carrigo sin productos"
    } 
    else{
      /*let cartProduct = cart.cartProducts.find((product) => product.id._id.toString()=== pid) 
      if(!cartProduct){
        console.log("no existe producto a borrar en el carrito")
      }*/
    }
    
    console.log("Cart Products",newCartProducts)
    console.log(cid)
    //const filter = {id: cid}
    //const datos = {cartProducts: newCartProducts}
    const newCart = await cartsModel.findByIdAndUpdate(cid, {cartProducts: newCartProducts}, {new:true})
    console.log("Nuevo cart",newCart)
    
  }catch(error){
    console.log(error)
  }
}

// METODO PUT - Actualiza el array del carrito entero por otro array
async updateCartProduct(cid, products){
    
  if (!cid){
    console.log("ATENCION: Debe ingresar un id valido")
    return "ATENCION: Debe ingresar un id valido"
  }

  if(!products){
    console.log("Atención: no se encuentran los datos de modificación")
    return "Atención: no se encuentran los datos de modificación"
  }
  else
  {
  
    try{
      const cart = await cartsModel.findById(cid)
      
      
      if(!cart){
        console.log("Carrito a modificar no existe")
        return "Carrito a modificar no existe"
      }

      cart.cartProducts = products
      await cart.save()
      
      /*const cartUpd = await cartsModel.findOneAndUpdate(cid, {cartProducts: products}, {new:true})
      console.log(cartUpd)*/
      return "OK"
    } 
    catch(error) {
      console.log(error)
    }
  }  
}

async updateCartProductQuantity(cid, pid, cantidad){
    
  if (!cid){
    console.log("ATENCION: Debe ingresar un id de carrito valido")
    return "ATENCION: Debe ingresar un id valido"
  }

  if (!pid){
    console.log("ATENCION: Debe ingresar un id de producto valido")
    return "ATENCION: Debe ingresar un id valido"
  }

  if(!cantidad){
    console.log("Atención: no se encuentran los datos a modificar")
    return "Atención: no se encuentran los datos de modificación"
  }
  else
  {
  
    try{
      console.log(cid)
      const cart = await cartsModel.findById(cid)

      console.log("VER CART")
      console.log(cart.cartProducts)
      
      if(!cart){
        console.log("Carrito a modificar no existe")
        return "Carrito a modificar no existe"
      }

      const product = await productsModel.findById(pid)
      
      if(!product){
        console.log("Producto a modificar no existe")
        return "Producto a modificar no existe"
      }

      console.log(cart.cartProducts)
      let prod = cart.cartProducts.find((product) => product.id._id.toString() === pid)
      prod.quantity = cantidad


      const cartUpd = await cartsModel.findOneAndUpdate(cid, {cartProducts: cart.cartProducts}, {new:true})
      console.log("resultado de la actualizacion")
      console.log(cartUpd)
      return "OK"
    } 
    catch(error) {
      console.log(error)
    }
  }  
}

  


}

