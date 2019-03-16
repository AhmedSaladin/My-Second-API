const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const ProductController = require('../controllers/products');


//configure multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, process.env.HOME + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    //reject a file
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, true)
    } else {
        cb(null, false)
        console.log("not saved")
    };
}
const upload = multer({ storage: storage, fileFilter: fileFilter });

// get method about all products
router.get('/', ProductController.Product_get_all);

//get method about one item
router.get('/:productId', ProductController.product_get_one);

//post method about add new product
router.post('/', checkAuth, upload.single("productImage"), ProductController.product_add);

// patch method about update a exist product
router.patch('/:productId', checkAuth, ProductController.product_update);

//delete method
router.delete('/:productId', checkAuth, ProductController.product_delete);


module.exports = router;