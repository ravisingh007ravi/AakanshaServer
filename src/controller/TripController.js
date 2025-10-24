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


exports.getAllTrip = async (req, res) => {
  try {
    const { cate } = req.params;
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 10; 
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    let query = { isActive: true };
    
    if (cate !== "All") query["location.city"] = cate;
    
    if (search) {
      query.$or = [
        { "location.city": { $regex: search, $options: 'i' } },
        { "location.address": { $regex: search, $options: 'i' } },
        { "location.state": { $regex: search, $options: 'i' } },
        { "location.country": { $regex: search, $options: 'i' } },
        { "title": { $regex: search, $options: 'i' } },
        { "description": { $regex: search, $options: 'i' } },
        { "activities": { $regex: search, $options: 'i' } },
        { "tags": { $regex: search, $options: 'i' } }
      ];
    }

    const total = await TripModel.countDocuments(query);
    const data = await TripModel.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }); 

    return res.status(200).send({status: true,total,page,totalPages: Math.ceil(total / limit),limit,data,search: search || null});
  } 
  catch (error) {
    AllError(error, res);
  }
};


exports.getTripById =async(req,res)=>{
  try {
    const id = req.params.id;
    const data = await TripModel.findById(id);
    return res.status(200).send({ status: true, data: data });
  } catch (error) {
    AllError(error, res);
  }
}




