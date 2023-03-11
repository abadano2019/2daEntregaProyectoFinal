// Clase para generar instancias de los productos de los carritos

export default class CartProducts {
    id
    quantity
  
    constructor(id){
      this.id = id
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
