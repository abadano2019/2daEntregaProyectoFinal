import { comparePasswords, hashPassword } from '../../utils.js'

import { userModel } from '../models/users.model.js'

export default class UsersManager {
  async createUser(user) {
    const { email, password } = user
    try {
      const existeUsuario = await userModel.find({ email })
      let rolUser = 'usuario'
      console.log('existe', existeUsuario)
      if (existeUsuario.length === 0) {
        console.log(email)
        if(email === "adminCoder@coder.com"){
          rolUser = "admin"
        }
        const hashNewPassword = await hashPassword(password)
        const newUser = { ...user, password: hashNewPassword, rol: rolUser }
        await userModel.create(newUser)
        return newUser
      } else {
        return null
      }
    } catch (error) {
      console.log(error)
      throw new Error(error)
    }
  }

  // abcdefg

  async loginUser(user) {
    const { email, password } = user
    const usuario = await userModel.findOne({ email })
    if (usuario) {
      const isPassword = await comparePasswords(password, usuario.password)
      if (isPassword) {
        console.log("son iguales")
        return usuario
      }
    }
    return null
  }
}
