import Product from "../../js/product.js"
import {messagesModel} from "../models/messages.model.js";

export default class ProductsManager {

    async getMessages(){
        try{
            const messagesDB = await messagesModel.find()
            return messagesDB
        }catch
        (error){
            console.log('Error: GetMessages', error)
        }
    }

    createMensaje(user, message){
    
        // validación de los campos para que no sean undefined, compos obligatorios
       /* if((!title) || (!description) || (!price) || (!code) || (!stock) || (!status) || (!category) ){
          console.log('Atención: Los campos del productos son obligatorios (title, description, price, thumbnails, code, stock,category)')
          return "Atención: Los campos del productos son obligatorios (title, description, price, thumbnails, code, stock,category"
        }*/
        
        // validación de los campos, se solicita que no sean vacios
        if(user === '' || message===''){
          console.log('Atención: Verifique los campos a ingresar (user, mensage)')
          return "Atención: Verifique los campos a ingresar (user,mansage)"
        } 
        
        const chatMessage = {
            user: user,
            message: message,
        }
        return chatMessage 
    
      }

      
  // Metodo que agrega un producto a la colección de productos almacenada en el archivo ubicado en la dirección 
  // almacenada en el atributo path de la clase. El metodo recibe una instancia del objeto Product.
  async addMessage(message) {

    // si el campo code no ha sido ingresado en ningun producto procedemos al alta en la colección
    try{
      if (message)
        {
          const newMessage = await messagesModel.create(message)
          console.log(newMessage)
          console.log("mensaje agregado")
          return "ADDPROD-COD2"
        }
        else
        {
          console.log("Mensaje invalido")
        }
      }catch (error) {
        console.log('Error en el alta de mensaje, Log detallado: ', error)
        return "ADDPROD-COD1"
        
      }
    }    


}

