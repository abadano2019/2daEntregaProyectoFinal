// Clase utilizada para instanciar los datos de los productos para luego ser dados de alta a la colección junto al
// id generado. También es usada para la modificación de datos, se deberá crear la instancia tal cual existe en 
// la colección de productos con los campos que se desean modificar, puede ser uno o todos, la modificacón se 
// realizará por id.

export default class Product {
    title
    description
    price
    thumbnail
    code
    stock
    status
    category
  
    constructor(title, description, price, thumbnail, code, stock, status = true, category){
      this.title = title
      this.description = description
      this.price = price
      this.thumbnail = thumbnail
      this.code = code
      this.stock = stock
      this.status = status
      this.category = category
    }
  
  }
