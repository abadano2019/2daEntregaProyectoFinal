// Clase para generar instancias de los productos de los carritos

export default class CartProduct {
    idProduct
    quantity
  
    constructor(idProduct){
      this.idProduct = idProduct
      this.quantity = 1
      
    }

    addQuantity(){
      this.quantity = this.quantity + 1
    }

    subtractQuantity(){
      if(this.quantity > 0){
        this.quantity = this.quantity - 1
      }
    }
  
  }
