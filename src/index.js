const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const router =require('./routes/routes');
require('dotenv').config();

const app = express(); 
const Port = 8000
app.use(express.json())
app.use(cors());

mongoose.connect(process.env.MongoDB)
    .then(() => console.log("Mongoose is Connected 😊😊"))
    .catch((err) => console.log(err.message));

app.use('/', router)

app.listen(Port, () => console.log(`Server is running on port ${Port}`));  








    
