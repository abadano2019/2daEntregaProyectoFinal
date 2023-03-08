// Desafio entregable Nro 4, Programación Backend
// Tema: Primera preentrega
// Titular: Ariel Badano
// CoderHouse

// Manejador de carritos

import CartProduct from '../../js/cartProduct.js'
import { cartsModel } from '../models/carts.model.js'
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
    const cart = await cartsModel.findById(idCart).lean()
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
    const cartProduct = new CartProduct(pid)
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

  // Metodo para agregar un producto de carrito a un carrito
  async addProductCart(cid,pid){
    try{
      
      let cart = await cartsModel.findById(cid)
      console.log(cart)
      let newCartProducts = []
      if(!cart){
        console.log("carrito no encontrado")
        return
      }

      if(cart?.cartProducts.length === 0){
        console.log("llegue")
        const product = this.createCartProduct(pid)
        newCartProducts.push(product)
      } 
      else{
        let cartProduct = cart.cartProducts.find((product) => product.idProduct === pid) 
        if(!cartProduct){
          const product = this.createCartProduct(pid)
          newCartProducts = [...cart.cartProducts, product]
        }
        else{
          cartProduct.quantity = cartProduct.quantity + 1
          console.log("es este?")
          newCartProducts = cart.cartProducts
          console.log("es este2?")    
        }
      }
      
      console.log("CArt Products",newCartProducts)
      console.log(cid)
      //const filter = {id: cid}
      //const datos = {cartProducts: newCartProducts}
      const newCart = await cartsModel.findByIdAndUpdate(cid, {cartProducts: newCartProducts}, {new:true})
      console.log("Nuevo cart",newCart)
      
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
      let cartProduct = cart.cartProducts.find((product) => product.idProduct === pid) 
      if(!cartProduct){
        console.log("no existe producto a borrar en el carrito")
      }
      else{
        let filteredProducts = cart.cartProducts.filter((product) => product.idProduct !== pid) 
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

    if(cart?.cartProducts.length === 0){
      console.log("Carrito sin productos")
    } 
    else{
      let cartProduct = cart.cartProducts.find((product) => product.idProduct === pid) 
      if(!cartProduct){
        console.log("no existe producto a borrar en el carrito")
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
      
      const cartUpd = await cartsModel.findOneAndUpdate(cid, {cartProducts: products}, {new:true})
      console.log(cartUpd)
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
      let prod = cart.cartProducts.find((product) => product.idProduct === pid)
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

