const express = require("express");
const appUser = express();
const appProduct = express();
const cors = require('cors')

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

appUser.use(cors())

appUser.use(bodyParser.urlencoded({ extended: true }));
appUser.use(bodyParser.json());
appUser.use(cookieParser());

appProduct.use(cors())

appProduct.use(bodyParser.urlencoded({ extended: true }));
appProduct.use(bodyParser.json());
appProduct.use(cookieParser());


appUser.use('/api/users', require('./routes/users'));
appProduct.use('/api/products', require('./routes/products'));


const portUser = 4444
const portProduct = 4445

appUser.listen(portUser, () => {
  console.log(`Server User Running at ${portUser}`)
});

appProduct.listen(portProduct, () => {
  console.log(`Server Product Running at ${portProduct}`)
});