const { AllError } = require('../error/errorhandling')
const jwt = require('jsonwebtoken')
require('dotenv').config()


exports.adminAuthentication = async (req, res, next) => {
    try {
        const token = req.headers['x-api-key']
        
        if (!token) { return res.status(400).send({ status: false, msg: "Token must be present" }) }

        const decodedToken = jwt.verify(token, process.env.AdminTokenKey)
         req.userId = decodedToken.userId 
        next()
    }
    catch (err) { AllError(err, res) }
}

exports.adminAuthorization = async (req, res, next) => {
    try {
       const AdminTokenId = req.userId
        const id = req.params.id
       
        if(!id) return res.status(400).send({status:false,msg:"id must be present"})

        if(!(AdminTokenId==id)) return res.status(400).send({status:false,msg:"Unauthorized Admin"})
           
        next()
    }
    catch (err) { AllError(err, res) }
}