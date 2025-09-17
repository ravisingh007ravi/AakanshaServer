const TripModel = require("../model/productModel");
const {AllError} = require("../error/errorhandling")
const {ProductLoadImg,deleteProfileImg} = require("../images/UploadImg")
exports.CreateTrip = async (req, res) => {
  try {
    let data = req.body;

    const img = req.file
    if (!img) return res.status(400).send({ status: false, msg: "img must be present" })

     const checkProduct = await TripModel.findOne({title:data.title})
    console.log(checkProduct)
     if (checkProduct) return res.status(400).send({ status: false, msg: "Product Already Create" })

    const jsonFields = ["location", "itinerary", "inclusions", "exclusions", "coordinates"];
    jsonFields.forEach((field) => {data[field] = JSON.parse(data[field])});

    const numberFields = ["price", "discount", "maxPeople", "availableSlots"];
    numberFields.forEach((field) => {
      if (data[field]) data[field] = Number(data[field]);
    });

    const booleanFields = ["isActive"];
    booleanFields.forEach((field) => {
      if (data[field]) data[field] = data[field] === "true";
    });
 
    data.productImg = await ProductLoadImg(img.path)
    const DB = await TripModel.create(data);
    return res.status(200).send({ status: true, data: DB });

  } catch (error) {
    AllError(error, res);
  }
};




