// Clase para generar instancias de los carritos

export default class Cart {
    id
    cartProducts
  
    constructor(id){
      this.id = id
      this.cartProducts = []
    }

    getCartProducts(){
      return this.cartProducts
    }

    getProductById(idCart) {
      
      const cartProduct = this.cartProducts.find((cart) => cart.id === parseInt(idCart))
      if (!cartProduct)
      {
        console.log("Error: Not Found")
      }
      else
      {
        console.log("Producto encontrado: " + 
                    "id: " + cartProduct.id + 
                    " producto: " + JSON.stringify(cartProduct))
        return cartProduct
      }
    }
}
