const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const OrderController =require("../controllers/orders");

//get  method about all order
router.get('/', checkAuth,OrderController.orders_get_all);

//get method about one order
router.get('/:orderId', checkAuth,OrderController.orders_get_one);


//post method about adding new order
router.post('/', checkAuth,OrderController.orders_creat_one);

//delete method about delete order
router.delete('/:orderId', checkAuth,OrderController.orders_deleting );



module.exports = router;