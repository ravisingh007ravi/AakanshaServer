const userModel = require('../model/UserModel')
const { AllError } = require('../error/errorhandling')

exports.getAllUserData = async (req, res) => {
    try {
        const data = await userModel.find()
        return res.status(200).send({ status: true, data: data })
    }
    catch (e) { AllError(e, res) }
}