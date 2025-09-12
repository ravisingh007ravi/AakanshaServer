const { AllError } = require('../error/errorhandling')
const jwt = require('jsonwebtoken')
require('dotenv').config()


exports.userAuthentication = async (req, res, next) => {
    try { 
  
        const token = req.headers['x-api-key']
        if (!token) { return res.status(400).send({ status: false, msg: "Token must be present" }) }

        const decoded = jwt.verify(token, process.env.UserTokenKey)
        req.userId = decoded.userId 


        next()
    }
    catch (err) { AllError(err, res) }
}

exports.userAuthorization = async (req, res, next) => {
    try {
       const userId = req.userId
        const id = req.params.id
       
        if(!id) return res.status(400).send({status:false,msg:"id must be present"})

        if(!(userId==id)) return res.status(400).send({status:false,msg:"Unauthorized Admin"})
           
        next()
    }
    catch (err) { AllError(err, res) }
}