// Desafio entregable Nro 4, Programación Backend
// Tema: Primera preentrega
// Titular: Ariel Badano
// CoderHouse

// Manejador de productos

import Product from '../../js/product.js'
import fs from 'fs'

export default class ProductManager {
  
  #id = 1
  #path = ""

  // Constructor de la clase recibe la ruta donde se encuentra el archivo donde se almacena la información
  // en caso de existir el archivo y que contenga elementos de la colección se toma el ultimo id para setear
  // el atributo id de la clase
  constructor() {

    this.#path = './productos.json'
    try{
      if (fs.existsSync(this.#path)){
        
        const productos = fs.readFileSync(this.#path, 'utf-8')
        const productosJS = JSON.parse(productos)
        const maxId = Math.max(...productosJS.map(product => product.id), 0);
        console.log("ID MAXIMO")
        console.log(maxId)
        this.#id = maxId + 1
      }
    }
    catch(error){
      console.log(error)
    }

  }

  dataTypeValidation(title,description,price,thumbnails,code,stock,status, category){
    
    if(typeof(title) !== 'string'){
      return "Title es un campo string"
    } 
    
    if(typeof(description) !== 'string'){
      return "Description es un campo string"
    } 

    if(typeof(code) !== 'string'){
      return "Code es un campo string"
    } 

    if(typeof(category) !== 'string'){
      return "Category es un campo string"
    } 
    
    if(typeof(price) !== 'number'){
      return "Price es un campo numerico"
    }  

    if(typeof(stock) !== 'number'){
      return "Stock es un campo numerico"
    }  

    if(typeof(status) !== 'boolean'){
      return "status es un campo booleano"
    }
    
    return "ok"

  }


  dataTypeValidationUpdate(title,description,price,thumbnails,code,stock,status, category){
    
    if(typeof(title) !== 'string' && title !== undefined){
      return "Title es un campo string"
    } 
    
    if(typeof(description) !== 'string' && description !== undefined){
      return "Description es un campo string"
    } 

    if(typeof(code) !== 'string' && code !== undefined){
      return "Code es un campo string"
    } 

    if(typeof(category) !== 'string' && category !== undefined){
      return "Category es un campo string"
    } 
    
    if(typeof(price) !== 'number' && price !== undefined){
      return "Price es un campo numerico"
    }  

    if(typeof(stock) !== 'number' && stock !== undefined){
      return "Stock es un campo numerico"
    }  

    if(typeof(status) !== 'boolean' && status !== undefined){
      return "status es un campo booleano"
    }
    
    if(!Array.isArray(thumbnails) && thumbnails !== undefined){
      return "Thumbnails es un campo que recibe un array"
    }


    return "OK"

  }


  // Metodo que devuelve la colección de productos almacenada en el archivo que se encuentra en la dirección
  // guardada en el atributo path de la clase. En caso de que el archivo aún no se haya creado devuelve un 
  // arreglo vacio.
  async getProducts() {
    try{
      if (fs.existsSync(this.#path)){
        const productos = await fs.promises.readFile(this.#path, "utf-8")
        const productosJS = JSON.parse(productos)
        return productosJS
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

  // Metodo que devuelve un producto dado un Id de producto, en caso de no existir en la colección el metodo
  // devuelve un mensaje "Error: Not Found" en caso contrario devuelve un mensaje con el id, el titulo y la
  // descripción por la consola además de devolver el objeto del producto encontrado.
  async getProductById(idProduct) {
    const productos = await this.getProducts();
    const producto = productos.find((product) => product.id === parseInt(idProduct))
    if (!producto)
    {
      console.log("Error: Not Found")
    }
    else
    {
      console.log("Producto encontrado: " + 
                  "id: " + producto.id + 
                  " title: " + producto.title + 
                  " descripción: " + producto.description)
      return producto
    }
  }


  // Metodo que creo un producto con las variables title, description, price, thumbnail, code y stock
  // se valida la no duplicación del campo code con productos ya ingresados a la colección, además de que los
  // campos ingresado existan y no sean vacios. En caso de cumplirse todos los anteriores supuestos el metodo 
  // devuelte una instancia del objete Producto.
  createProduct(title, description, price, thumbnails, code, stock, status, category){
    
    console.log(title, description, price, thumbnails, code, stock, status, category)

    console.log(!title)
     
    // validación de los campos para que no sean undefined, compos obligatorios
    /*if((!title) || (!description) || (!price) || (!code) || (!stock) || (!status) || (!category)){
      console.log('Atención 1234: Los campos del productos son obligatorios (title, description, price, thumbnails, code, stock,category)')
      return "Atención: Los campos del productos son obligatorios (title, description, price, thumbnails, code, stock,category"
    }*/
    
    // validación de los campos, se solicita que no sean vacios
    if(title === '' || description==='' || price ==='' || code === '' || stock === '' || status === '' || category === ''){
      console.log('Atención 2345: Verifique los campos a ingresar (title, description, price, thumbnails, code, stock, category)')
      return "Atención: Verifique los campos a ingresar (title, description, price, thumbnails, code, stock, category)"
    } 
    
    // crear producto 
    if(thumbnails === undefined){
      thumbnails = []
    }
    const producto = new Product(title,description,price,thumbnails,code,stock, status, category)
    return producto

  }

  createProductPut(title,description,price,thumbnails,code,stock,status,category){
    const producto = new Product(title,description,price,thumbnails,code,stock, status, category)
    return producto
  }

  // Metodo que agrega un producto a la colección de productos almacenada en el archivo ubicado en la dirección 
  // almacenada en el atributo path de la clase. El metodo recibe una instancia del objeto Product.
  async addProduct(producto) {

      // si el campo code no ha sido ingresado en ningun producto procedemos al alta en la colección
      try{
        if (producto){
          const productos = await this.getProducts()
          if(!this.#validarCode(productos, producto.code))
          {
            const prod = {
              id: this.#generarId(),
              ...producto,
            }
            productos.push(prod)  
            await fs.promises.writeFile(this.#path,JSON.stringify(productos))
            console.log("producto agregado")
            return "ADDPROD-COD2"
          }
          else
          {
            console.log("ATENCION: Verifique el campo Code, el mismo ya existe en otro producto")
            return "ADDPROD-COD1"
          }
        }
        else
        {
          console.log("Producto invalido")
        }
      }catch (error) {
        console.log(error)
      }
        
  }

          
  // Metodo que modifica un producto de la colección de productos almacenada en el archivo ubicado
  // en la dirección del atributo path de la clase, el metodo recibe un id un objeto del tipo Product y actualiza
  // el producto encontrado con los datos del producto pasado por parametro, el cual debe tener todos los campos
  // cargado. En caso de no querer modificar un datos se deberá mantener el mismo dato que ya existe en ese campo. 
  async updateProduct(id, producto){
    console.log(id)
    if (!id){
      console.log("ATENCION: Debe ingresar un id valido")
      return "ATENCION: Debe ingresar un id valido"
    }

    if(!producto){
      console.log("Atención: no se encuentran los datos de modificación")
      return "Atención: no se encuentran los datos de modificación"
    }
    else
    {
    
      try{
        const productos = await this.getProducts()
        console.log(productos)        
        const prod = productos.find((product) => product.id === parseInt(id))
        
        if(!prod){
          console.log("Producto a modificar no existe")
          return "Producto a modificar no existe"
        }

        if(this.#validarCode(productos, producto.code)){
          console.log("Error: Codigo a modificar ya existe en otro producto")
          return "Error: Codigo a modificar ya existe en otro producto"
        }
        
        console.log(producto.title)
        prod.title = (producto.title !== "" && producto.title !== undefined ) ? producto.title : prod.title
        prod.description = (producto.description !== "" && producto.description !== undefined) ? producto.description : prod.description
        prod.price = (producto.price!=="" && producto.price !== undefined) ? producto.price : prod.price
        prod.thumbnails = (producto.thumbnails && producto.thumbnails !== undefined ) ? producto.thumbnails : prod.thumbnails
        prod.code = (producto.code !== "" && producto.code !== undefined) ? producto.code : prod.code
        prod.stock = (producto.stock !== "" && producto.stock !== undefined) ? producto.stock : prod.stock 
        prod.status = (producto.status !== "" && producto.status !== undefined) ? producto.status : prod.status
        prod.category = (producto.category !== "" && producto.category !== undefined) ? producto.category : prod.category

        await fs.promises.writeFile(this.#path,JSON.stringify(productos))
        console.log("producto modificdo")
        return "OK"
      }
      catch(error) {
        console.log(error)
      }
    }  
  }

  async updateProductPut(id, title,description,price,thumbnails,code,stock,status ,category){


    if (!id){
      console.log("ATENCION: Debe ingresar un id valido")
      return
    }
    else
    {
    
      try{
        const productos = await this.getProducts()
        const prod = productos.filter((product) => product.id === parseInt(id))

        prod.title = title
        prod.description = (description !== "") ? description : prod.description 
        prod.price = (price!== "") ? price : prod.price
        prod.thumbnails = (thumbnails!== "") ? thumbnails : prod.thumbnails
        prod.code = (code!== "") ? code : prod.code
        prod.stock = (stock!== "") ? stock : prod.stock
        prod.status = (status!== "") ? status : prod.status
        prod.category = (category!== "") ? {category} : prod.category

        await fs.promises.writeFile(this.#path,JSON.stringify(productos))
        console.log("producto modificdo")
      }
      catch(error) {
        console.log(error)
      }
    }  
  }

  // Metodo que elimina un producto de la colección de productos almacenada en el archivo ubicado
  // en la dirección del atributo path de la clase, recibe el id del producto a ser eliminado. 
  async deleteProduct(id){

    if (!id){
      console.log("ATENCION: Debe ingresar un id valido")
      return
    }

    const productoEncontrado = await this.getProductById(id)
    console.log(productoEncontrado)
    if(!productoEncontrado) { 
      console.log("No existe producto con el id: " + id)
      return 
    }
    
    try{
      const productos = await this.getProducts()
      const newProducts = productos.filter((product) => product.id !== parseInt(id))
      await fs.promises.writeFile(this.#path,JSON.stringify(newProducts))
      console.log("producto eliminado")
    }
    catch(error) {
      console.log("Me fui por acá" + error)
    }  

  }

  // Metodo privado para la generación del id de los productos
  #generarId() {
    return this.#id++;
  }

  // Metodo privado para la validación del campo code de los productos, no se permite la duplicación.
  #validarCode(productos, newCode) {
    if(newCode !== undefined){
      return productos.find((product) => (product.code === newCode))
    }else{
    return false
    }
  }
}