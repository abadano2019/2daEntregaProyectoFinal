// Desafio entregable Nro 4, Programación Backend
// Tema: Primera preentrega
// Titular: Ariel Badano
// CoderHouse

// Manejador de carritos

import Cart from '../../js/cart.js'
import CartProduct from '../../js/cartProduct.js'
import fs from 'fs'

export default class CartsManager {
  
  #id = 1
  #path = ""
  
  // Constructor de la clase, recibe la ruta donde se encuentra el archivo donde se almacena la información
  // en caso de existir el archivo y que contenga elementos de la colección se toma el ultimo id para setear
  // el atributo id de la clase
  constructor(path) {

    this.#path = path
    try{
      if (fs.existsSync(this.#path)){
        
        const carts = fs.readFileSync(this.#path, 'utf-8')
        const cartsJS = JSON.parse(carts)
        const maxId = Math.max(...cartsJS.map(cart => cart.id), 0);
        console.log("ID MAXIMO")
        console.log(maxId)
        this.#id = maxId + 1
      }
    }
    catch(error){
      console.log(error)
    }

  }

  // Metodo que devuelve la colección de carritos almacenada en el archivo que se encuentra en la dirección
  // guardada en el atributo path de la clase. En caso de que el archivo aún no se haya creado devuelve un 
  // arreglo vacio.
  async getCarts() {
    try{
      if (fs.existsSync(this.#path)){
        const carts = await fs.promises.readFile(this.#path, "utf-8")
        const cartsJS = JSON.parse(carts)
        return cartsJS
      }
      else
      {
        return []
      }
    }
    catch(error){
      console.log(error)
    }
  }

  // Metodo que devuelve un carrito dado por un id de carrito, en caso de no existir en la colección el metodo
  // devuelve un mensaje "Error: Not Found" en caso contrario devuelve un mensaje con el id, el titulo y la
  // descripción por la consola además de devolver el objeto del carrito encontrado.
  async getCartById(idCart) {
    const carts = await this.getCarts();
    const cart = carts.find((cart) => cart.id === parseInt(idCart))
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
    const id = this.#generarId()
    const cart = new Cart(id)
       
    return cart
  
  }

  // Metodo que agrega un carrito a la colección de carritos almacenada en el archivo ubicado en la dirección 
  // almacenada en el atributo path de la clase. El metodo recibe una instancia del objeto cart.
  async addCart(cart) {

      try{
          const carts = await this.getCarts()
          carts.push(cart)  
          await fs.promises.writeFile(this.#path,JSON.stringify(carts))
          console.log("Carrito agregado")
          
      }catch (error) {
        console.log(error)
      }
        
  }

  // Metodo para agregar un producto de carrito a un carrito
  async addProductCart(cid,pid){
    try{

      let carts = await this.getCarts();
      let cart = carts.find((cart) => cart.id === parseInt(cid))
            
      if(cart){
          if(cart.cartProducts.length === 0){
            const product = this.createCartProduct(parseInt(pid))
            cart.cartProducts.push(product)
          }else{
            
            let cartProduct = cart.cartProducts.find((product) => product.idProduct === parseInt(pid)) 
            
            if(!cartProduct){
              const product = this.createCartProduct(parseInt(pid))
              cart.cartProducts.push(product)
            }
            else{
              cartProduct.quantity = cartProduct.quantity + 1     
            }
          }
      } 
      else
        {
          console.log("carrito no encontrado")
        } 

      await fs.promises.writeFile(this.#path,JSON.stringify(carts))
      
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

    const cartEncontrado = await this.getCartById(idCart)
    console.log(cartEncontrado)
    if(!cartEncontrado) { 
      console.log("No existe carrito con el id: " + id)
      return 
    }
    
    try{
      const carts = await this.getCarts()
      const newCarts = carts.filter((cart) => cart.id !== parseInt(idCart))
      await fs.promises.writeFile(this.#path,JSON.stringify(newCarts))
      console.log("Carrito eliminado")
    }
    catch(error) {
      console.log(error)
    }  

  }

  // Metodo privado para la generación del id de los productos
  #generarId() {
    return this.#id++;
  }


}

