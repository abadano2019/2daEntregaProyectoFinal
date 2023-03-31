import bcrypt from 'bcrypt'
import {dirname} from 'path'
import { fileURLToPath } from 'url'
import jwt from 'jsonwebtoken'
import multer from 'multer'

export const __dirname = dirname(fileURLToPath(import.meta.url))

export const hashPassword = async(password)=>{
    return bcrypt.hash(password,10)
    }
    
export const comparePasswords = async(password,passwordBD)=>{
        const compare = await bcrypt.compare(password,passwordBD)
        console.log(compare)
        return compare
}

export const generateToken = (user) => {
    const token = jwt.sign({ user }, 'secretJWT',{expiresIn:'1h'})
    return token
  }
  