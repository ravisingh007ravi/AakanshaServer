const { AllError } = require('../error/errorhandling')
const jwt = require('jsonwebtoken')
require('dotenv').config()


exports.userAuthentication = async (req, res, next) => {
    try {
        const token = req.headers['x-api-key']
        console.log(token)
        if (!token) { return res.status(400).send({ status: false, msg: "Token must be present" }) }

        // req.body.userId = decoded.userId
        const decoded = jwt.verify(token, process.env.UserTokenKey)
        console.log(decoded)

        next()
    }
    catch (err) { AllError(err, res) }
}