import { __dirname } from "../utils.js"
import multer from 'multer'

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,__dirname+'/public/img')
    },
    filename: function(req,file,cb){
        cb(null,file.originalname)
    }

})
  
export const upload = multer({ storage: storage })
