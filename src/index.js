const express = require('express');
const router =require('./routes/routes')

const app = express();

const Port = 8080;

app.use('/', router)

app.listen(Port, () => console.log(`Server is running on port ${Port}`));