const express = require('express');
const router = express.Router();
const { User } = require("../models/User");
const { Product } = require('../models/Product');
const { auth } = require("../middleware/auth");
const { Payment } = require('../models/Payment');

const async = require('async');

//=================================
//             User
//=================================


router.get("/auth", auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image,
        cart: req.user.cart,
        history: req.user.history
    });
});

router.post("/register", (req, res) => {

    const user = new User(req.body);

    user.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true
        });
    });
});

router.post("/login", (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user)
            return res.json({
                loginSuccess: false,
                message: "Auth failed, email not found"
            });

        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({ loginSuccess: false, message: "Sai mật khẩu" });
            if(user.status != 1){
                return res.json({ loginSuccess: false, message: "Tài khoản bị khóa" });
            }

            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                res.cookie("w_authExp", user.tokenExp);
                res
                    .cookie("w_auth", user.token)
                    .status(200)
                    .json({
                        loginSuccess: true, userId: user._id, token: user.token, tokenExp: user.tokenExp
                    });
            });
        });
    });
});

router.get("/logout", auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "", tokenExp: "" }, (err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        });
    });
});


router.get('/addToCart', auth, (req, res) => {

    User.findOne({ _id: req.user._id }, (err, userInfo) => {
        let duplicate = false;

        let itemCartId = req.query.productId + '_' +  req.query.size;

        userInfo.cart.forEach((item) => {
            if (item.id == itemCartId && item.size == req.query.size) {
                duplicate = true;
            }
        })


        if (duplicate) {
            User.findOneAndUpdate(
                { _id: req.user._id, "cart.id": itemCartId},
                { $inc: { "cart.$.quantity": parseInt(req.query.quantity, 10) } },
                { new: true },
                (err, userInfo) => {
                    if (err) return res.json({ success: false, err });
                    res.status(200).json(userInfo.cart)
                }
            )
        } else {
            User.findOneAndUpdate(
                { _id: req.user._id },
                {
                    $push: {
                        cart: {
                            id: req.query.productId + '_' + req.query.size,
                            product_id: req.query.productId,
                            quantity: parseInt(req.query.quantity, 10),
                            size: req.query.size,
                            date: Date.now()
                        }
                    }
                },
                { new: true },
                (err, userInfo) => {
                    if (err) return res.json({ success: false, err });
                    res.status(200).json(userInfo.cart)
                }
            )
        }
    })
});


router.get('/removeFromCart', auth, (req, res) => {

    User.findOneAndUpdate(
        { _id: req.user._id },
        {
            "$pull":
                { "cart": { "id": req.query._id } }
        },
        { new: true },
        (err, userInfo) => {
            let cart = userInfo.cart;
            let array = cart.map(item => {
                return item.product_id
            })

            Product.find({ '_id': { $in: array } })
                .populate('writer')
                .exec((err, cartDetail) => {
                    return res.status(200).json({
                        cartDetail: cartDetail ?? [] ,
                        cart
                    })
                })
        }
    )
})


router.get('/userCartInfo', auth, (req, res) => {
    User.findOne(
        { _id: req.user._id },
        (err, userInfo) => {
            let cart = userInfo.cart;
            let array = cart.map(item => {
                return item.product_id
            })


            Product.find({ '_id': { $in: array } })
                .populate('writer')
                .exec((err, cartDetail) => {
                    if (err) return res.status(400).send(err);
                    return res.status(200).json({ success: true, cartDetail, cart })
                })

        }
    )
})




router.post('/successBuy', auth, (req, res) => {
    let history = [];
    let transactionData = {};

    req.body.cartDetail.forEach((item) => {
        history.push({
            dateOfPurchase: Date.now(),
            name: item.title,
            id: item.id,
            price: item.price,
            quantity: item.quantity,
            product_id: item.product_id,
            size: item.size,
            paymentId: item.id + '_' + Date.now(),
            status: 'Chờ duyệt'
        })
    })

    transactionData.user = {
        id: req.user._id,
        name: req.user.name,
        lastname: req.user.lastname,
        email: req.user.email
    }

    transactionData.data = req.body.paymentData;
    transactionData.product = history;
    transactionData.phone = req.body.phone;
    transactionData.address = req.body.address;


    User.findOneAndUpdate(
        { _id: req.user._id },
        { $push: { history: history }, $set: { cart: [] } },
        { new: true },
        (err, user) => {
            if (err) return res.json({ success: false, err });


            const payment = new Payment(transactionData)
            payment.save((err, doc) => {
                if (err) return res.json({ success: false, err });
                let products = [];
                doc.product.forEach(item => {
                    products.push({ id: item.product_id, quantity: item.quantity })
                })

                async.eachSeries(products, (item, callback) => {
                    Product.updateOne(
                        { _id: item.id },
                        {
                            $inc: {
                                "sold": item.quantity
                            }
                        },
                        { new: false },
                        callback
                    )
                }, (err) => {
                    if (err) return res.json({ success: false, err })
                    res.status(200).json({
                        success: true,
                        cart: user.cart,
                        cartDetail: []
                    })
                })

            })
        }
    )
})


router.get('/getHistory', auth, (req, res) => {
    User.findOne(
        { _id: req.user._id },
        (err, doc) => {
            let history = doc.history;
            if (err) return res.status(400).send(err)
            return res.status(200).json({ success: true, history })
        }
    )
})


router.post('/getPending', auth, (req, res) => {
    Payment.find(
        { "product": { $elemMatch: { "product_id": { $in: req.body.productIds } } } },
        (err, payment) => {
            if (err) return res.status(400).send(err)
            return res.status(200).json({ success: true, payment })
        }
    )
})

router.post('/changePending', auth, async (req, res) => {
    let userId = req.body.userId;
    let paymentId = req.body.paymentId;
    let historyIdsUpdate = req.body.historyIdsUpdate;
    let newStatus = req.body.newStatus;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.history.forEach(item => {
      if (historyIdsUpdate.includes(item.id)) {
        item.status = newStatus;
      }
    });

    user.markModified('history');

    await user.save();

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    payment.product.forEach(item => {
      if (historyIdsUpdate.includes(item.id)) {
        item.status = newStatus;
      }
    });

    payment.markModified('product');

    await payment.save();

    return res.status(200).json({ message: 'ok' });
})

// admin

router.get('/admin/users', auth, async (req, res) => {
    User.find({ "_id": { $nin : req.user._id} })
            .exec((err, users) => {
                if (err) return res.status(400).json({ success: false, err })
                res.status(200).json({ success: true, users })
            })
})

router.post('/admin/users/changePassword', auth, async (req, res) => {
    const user = await User.findById(req.body.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = req.body.newPassword;

    user.markModified('password');
    await user.save();
    res.status(200).json({ success: true })
})

router.post('/admin/users/block', auth, async (req, res) => {
    const user = await User.findById(req.body.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.status = req.body.status;

    user.markModified('status');
    await user.save();
    res.status(200).json({ success: true })
})

router.post('/admin/users/delete', auth, async (req, res) => {
    User.findOneAndDelete({ _id: req.body.id },)
        .exec((error, doc)=>{
            if(error) return res.status(400).json({ success: false, error});
            res.status(200).json({ success: true, doc })
        })
})

router.get('/admin/products', auth, async (req, res) => {
    Product.find({})
    .limit(20)
    .exec(async (err, products) => {
        if (err) return res.status(400).json({ success: false, err });
        const productsWithWriter = await Promise.all(
            products.map(async (product) => {
              let user = await User.findById(product.writer);
              product = product.toObject();
              product.writer = user;
              return product;
            })
          );
      
          res.status(200).json({ success: true, products: productsWithWriter });
    });
})

router.get('/admin/payments', auth, async (req, res) => {
    Payment.find({})
    .limit(20)
    .exec(async (err, payments) => {
        if (err) return res.status(400).json({ success: false, err });
      
        res.status(200).json({ success: true, payments });
    });
})

router.get("/users_check", (req, res) => {
    return res.status(200).send('users server running in port 4444');
});


module.exports = router;
