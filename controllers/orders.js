const Order = require('../models/order');
const Product = require('../models/product');
const mongoose = require('mongoose');



// view all orders
exports.orders_get_all = (req, res, next) => {
    Order.find({})
        .select('quantity product _id')
        .populate('product', 'name', Product)
        .exec()
        .then(doc => {
            res.status(200).json({
                count: doc.length,
                orders: doc.map(doc => {
                    return {
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request: {
                            type: "GET",
                            url: "http://localhost:9000/orders/" + doc._id
                        }
                    }
                })
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
}


//view single order
exports.orders_get_one = (req, res, next) => {
    if (mongoose.Types.ObjectId.isValid(req.params.orderId)) {
        Order.findOne({ _id: req.params.orderId })
            .select("_id product quantity")
            .populate('product', 'name', Product)
            .then((doc) => {
                if (doc) {
                    console.log(doc);
                    res.status(200).json(doc);
                } else {
                    console.log("nod data exist for this id");
                    res.status(404).json({ message: "not found" });
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ error: err });
            });
    } else {
        console.log("it work");
        res.status(200).json({ message: "id not found" });
    }
}

// adding new order
exports.orders_creat_one = (req, res, next) => {
    const order = new Order({
        quantity: req.body.quantity,
        product: req.body.productId
    });
    if (mongoose.Types.ObjectId.isValid(req.body.productId)) {
        order.save()
            .then(result => {
                console.log(result);
                res.status(200).json({
                    message: 'order stored',
                    createdOrder: {
                        _id: result._id,
                        product: result._id,
                        quantity: result.quantity
                    },
                    request: {
                        type: "GET",
                        url: "http://localhost:9000/orders/" + result._id
                    }
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err

                });
            });
    } else {
        console.log("product checking work");
        res.status(200).json({ message: "product not found" });
    }

}

// deleting order
exports.orders_deleting = (req, res, next) => {
    Order.findOneAndDelete({ _id: req.params.orderId })
        .exec()
        .then(() => {
            res.status(200).json({ message: "order deleted" })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err })
        });
}