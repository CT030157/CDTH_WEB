const mongoose = require('mongoose');
const config = require('../config/dev');
const dbPayment = mongoose.createConnection(config.mongoPaymentURI)

const paymentSchema = mongoose.Schema({
    user: {
        type: Array,
        default: []
    },
    data: {
        type: Array,
        default: []
    },
    product: {
        type: Array,
        default: []
    },
    phone: {
        type: String
    },
    address: {
        type: String
    },
    status: {
        type: String
    },


}, { timestamps: true })


const Payment = dbPayment.model("payments", paymentSchema);

module.exports = { Payment }