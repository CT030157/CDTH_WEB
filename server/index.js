const express = require("express");
const appUser = express();
const appProduct = express();
const path = require("path");
const cors = require('cors')

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

// const config = require("./config/dev");


// const mongoose = require("mongoose");
// const connect = mongoose.connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('MongoDB Connected...'))
//   .catch(err => console.log(err));

appUser.use(cors())

appUser.use(bodyParser.urlencoded({ extended: true }));
appUser.use(bodyParser.json());
appUser.use(cookieParser());

appProduct.use(cors())

appProduct.use(bodyParser.urlencoded({ extended: true }));
appProduct.use(bodyParser.json());
appProduct.use(cookieParser());


appUser.use('/api/users', require('./routes/users'));
appProduct.use('/api/product', require('./routes/product'));



appProduct.use('/uploads', express.static('uploads'));


// if (process.env.NODE_ENV === "production") {


//   app.use(express.static("client/build"));

//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
//   });
// }

const portUser = 4444
const portProduct = 4445

appUser.listen(portUser, () => {
  console.log(`Server User Running at ${portUser}`)
});

appProduct.listen(portProduct, () => {
  console.log(`Server Product Running at ${portProduct}`)
});