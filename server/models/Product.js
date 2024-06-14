const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.set('useFindAndModify', false);
const config = require('../config/dev');
const { text } = require('body-parser');
const dbProduct = mongoose.createConnection(config.mongoProductURI)

const productSchema = mongoose.Schema({
    writer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        text: true,
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        default: 0
    },
    images: {
        type: Array,
        default: []
    },
    category: {
        type: Number,
        default: 1
    },
    sold: {
        type: Number,
        maxlength: 100,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    }
}, { timestamps: true })


productSchema.index({ 
    title:'text',
    description: 'text',
    writer:'oid',
}, {
    weights: {
        writer:10,
        title: 5,
        description: 1,
    }
})


const Product = dbProduct.model('products', productSchema);

module.exports = { Product }