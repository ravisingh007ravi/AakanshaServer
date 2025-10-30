const BookModel = require("../model/TripModel");
const ProductModel = require("../model/productModel");
const { AllError } = require("../error/errorhandling");


exports.BookTrip = async (req, res) => {
    try {
        const { productId, id } = req.params;
        const data = req.body;

        console.log(productId,id)
        console.log(data)
        if (!productId) return res.status(400).send({ status: false, msg: "productId must be present" });

        
        const checkProduct = await ProductModel.findById(productId);
        if (!checkProduct) return res.status(400).send({ status: false, msg: "Product not found" });
        
        data.trip = productId
        data.user = id
        data.totalPrice= data.seats * checkProduct.price

        const DB = await BookModel.create(data);
        const product = await ProductModel.findByIdAndUpdate(productId, { $inc: { "availableSlots": -data.seats } })
        return res.status(200).send({ status: true, DB: DB });
    }
    catch (error) { AllError(error, res); }
}

exports.getAllBookTrip = async (req, res) => {
    try {
        const data = await BookModel.find();
        return res.status(200).send({ status: true, data: data });
    }
    catch (error) { AllError(error, res); }
}