const express = require("express");
const appUser = express();
const appProduct = express();
const path = require("path");
const cors = require('cors')

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");


appUser.use(cors())

appUser.use(bodyParser.urlencoded({ extended: true }));
appUser.use(bodyParser.json());
appUser.use(cookieParser());


appUser.use('/api/users', require('./routes/users'));


const portUser = 4444

appUser.listen(portUser, () => {
  console.log(`Server User Running at ${portUser}`)
});
