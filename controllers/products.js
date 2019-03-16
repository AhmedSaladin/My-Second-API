const Product = require('../models/product');


// view all products
exports.Product_get_all = (req, res, next) => {
    Product.find({})
        .select("_id name price productImage")
        .exec()
        .then(product => {
            //get specific view of data i want
            const response = {
                count: product.length,
                products: product.map(product => {
                    return {
                        name: product.name,
                        price: product.price,
                        _id: product._id,
                        productImage: product.productImage,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:9000/products/' + product._id
                        }
                    }
                })
            };//
            res.status(200).json(response)
        }).catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
}


//view single product
exports.product_get_one = (req, res, next) => {
    Product.findOne({ _id: req.params.productId })
        .select('name price _id productImage')
        .exec()
        .then(function (Product) {
            console.log("from database ", Product);
            if (Product) {
                res.status(200).json(Product);
            } else {
                res.status(404).json({ message: "Nothing Here " });
            }
        }).catch(err => {
            console.log(err);
            res.status(500).json(err);
        })

}


//adding new product
exports.product_add = (req, res, next) => {
    const product = new Product({
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    })
    product.save()
        .then(result => {
            res.status(200).json({
                message: " Created product successfully",
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    productImage: result.productImage,
                    request: {
                        type: "GET",
                        url: "http://localhost:9000/products/" + result._id
                    }

                }
            });
        }).catch(err => {
            console.log(err);
            res.status(500).json(err);

        })
}


// updating product 
exports.product_update = (req, res, next) => {
    Product.findOneAndUpdate({ _id: req.params.productId }, req.body)
        .exec()
        .then(function () {
            Product.findOne({ _id: req.params.productId })
                .then(Product => {

                    res.status(200).json({
                        message: "product updated",
                        request: {
                            type: "GET",
                            url: "http://localhost:9000/products/" + Product._id

                        }

                    });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json(err);
                });
        });
}


// delete product
exports.product_delete = (req, res, next) => {
    Product.findOneAndDelete({ _id: req.params.productId })
        .exec()
        .then(() => {
            res.status(200).json({
                message: "product deleted",
                request: {
                    type: "POST",
                    url: 'http://localhost:9000/products',
                    body: { name: "string", price: "number" }

                }
            });
        }).catch(err => {
            console.log(err);
            res.status(500).json(err);
        });

}