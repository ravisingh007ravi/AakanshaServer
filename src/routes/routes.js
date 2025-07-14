const express = require('express');
const { getAllData } = require('../controller/userController')

const routes = express.Router();


routes.get('/ravi', getAllData)

module.exports = routes

