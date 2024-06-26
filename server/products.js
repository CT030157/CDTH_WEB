const express = require("express");
const appProduct = express();
const cors = require('cors')

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");


appProduct.use(cors())

appProduct.use(bodyParser.urlencoded({ extended: true }));
appProduct.use(bodyParser.json());
appProduct.use(cookieParser());


appProduct.use('/api/products', require('./routes/products'));



const portProduct = 4445

appProduct.listen(portProduct, () => {
  console.log(`Server Product Running at ${portProduct}`)
});