const express = require('express');
const router = express.Router();
const { Product } = require("../models/Product");
const multer = require('multer');

const { auth } = require("../middleware/auth");
const { isValidObjectId } = require('mongoose');

const { initializeApp } = require('firebase/app');
const { getStorage, ref, getDownloadURL, uploadBytesResumable } = require('firebase/storage');
const config = require('../config/dev');

initializeApp(config.firebaseConfig);

const storage = getStorage();

const upload = multer({ storage: multer.memoryStorage() });




//=================================
//             Product
//=================================

router.post("/uploadImage", auth, upload.single("file"), async (req, res) => {


    try {
        const storageRef = ref(storage, `images/${Date.now() + '_' + req.file.originalname}`);

        const metadata = {
            contentType: req.file.mimetype,
        };

        const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);

        const downloadURL = await getDownloadURL(snapshot.ref);

        return res.send({
            message: 'file uploaded to firebase storage',
            fileName: Date.now() + '_' + req.file.originalname,
            image: downloadURL,
            success: true
        })
    } catch (error) {
        return res.status(400).send(error.message)
    }

});


router.post("/uploadProduct", auth, (req, res) => {

    const product = new Product(req.body)

    product.save((err) => {
        if (err) return res.status(400).json({ success: false, err })
        return res.status(200).json({ success: true })
    })

});

router.post("/edit", auth, (req, res) => {
    const filters = {_id: req.body._id}
    const updates = {
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        images: req.body.images,
        category: req.body.category,
    }
    const opts = { new: true }
    Product.findOneAndUpdate(filters,updates,opts)
    .exec((err,doc)=>{
        if(err) return res.status(400).json({ success: false, err})
        return res.status(200).json({ success: true, doc})
    })
});

router.post("/delete", auth, (req, res) => {
    let productIds = req.body._id
    Product.findOneAndDelete({ '_id': { $in: productIds } })
        .exec((error, doc)=>{
            if(error) return res.status(400).json({ success: false, error});
            res.status(200).json({ success: true, doc })
        }) 
});


router.post("/getProducts", (req, res) => {

    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id"; 
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let writer = req.body.writer;

    let findArgs = {};
    let term = req.body.searchTerm;

    for (let key in req.body.filters) {

        if (req.body.filters[key].length > 0) {
            if (key === "price") {
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                }
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }

    if (writer !== ''){
        if (term) {
            Product.find(findArgs)
                .find({ $text: { $search: term } })
                .find({ "writer": { $nin : writer} })
                .sort([[sortBy, order]])
                .skip(skip)
                .limit(limit)
                .exec((err, products) => {
                    if (err) return res.status(400).json({ success: false, err })
                    res.status(200).json({ success: true, products, postSize: products.length })
                })
        } else {
            Product.find(findArgs)
                .find({ "writer": { $nin : writer} })
                .sort([[sortBy, order]])
                .skip(skip)
                .limit(limit)
                .exec((err, products) => {
                    if (err) return res.status(400).json({ success: false, err })
                    res.status(200).json({ success: true, products, postSize: products.length })
                })
        }
    } else {
        if (term) {
            Product.find(findArgs)
                .find({ $text: { $search: term } })
                .sort([[sortBy, order]])
                .skip(skip)
                .limit(limit)
                .exec((err, products) => {
                    if (err) return res.status(400).json({ success: false, err })
                    res.status(200).json({ success: true, products, postSize: products.length })
                })
        } else {
            Product.find(findArgs)
                .sort([[sortBy, order]])
                .skip(skip)
                .limit(limit)
                .exec((err, products) => {
                    if (err) return res.status(400).json({ success: false, err })
                    res.status(200).json({ success: true, products, postSize: products.length })
                })
        }
    }

});

router.post("/getWriter", (req, res) => {
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id"; 
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let writer = req.body.searchWrite;
    Product
            .find({ "writer": { $in : writer} })
            .sort([[sortBy, order]])
            .skip(skip)
            .limit(limit)
            .exec((err, products) => {
                if (err) return res.status(400).json({ success: false, err })
                res.status(200).json({ success: true, products, postSize: products.length })
            })
    
});


router.get("/products_by_id", (req, res) => {
    let type = req.query.type
    let productIds = req.query.id

    if (type === "array") {
        let ids = req.query.id.split(',');
        productIds = [];
        productIds = ids.map(item => {
            return item
        })
    }
    
    Product.updateOne(
        { _id: productIds },
        {
            $inc: {
                views: 1
            }
        }
    )
    .exec((err, product) => {
            if (err) return res.status(400).send(err)
            // return res.status(200).send(product)
        })
 
    Product.find({ '_id': { $in: productIds } })
        // .populate('writer')
        .exec((err, product) => {
            if (err) return res.status(400).send(err)
            return res.status(200).send(product)
        })
});


router.get("/products_check", (req, res) => {
    return res.status(200).send('products dmm');
});

module.exports = router;
