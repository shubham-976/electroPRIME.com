const express = require('express');
const router = express.Router();
const {newOrder, myAllOrders, mySingleOrder, getAllOrders, updateOrderStatus, deleteOrder} = require('../controllers/orderController');
const {isUserAuthenticated, isUserRoleAuthorized} = require("../middleware/authentication")

router.route("/order/new").post(isUserAuthenticated, newOrder);
router.route("/order/:orderId").get(isUserAuthenticated, mySingleOrder);
router.route("/orders/me").get(isUserAuthenticated, myAllOrders);
router.route("/admin/orders").get(isUserAuthenticated, isUserRoleAuthorized("admin"), getAllOrders);
router.route("/admin/order/:orderId").put(isUserAuthenticated, isUserRoleAuthorized("admin"), updateOrderStatus);
router.route("/admin/order/:orderId").delete(isUserAuthenticated, isUserRoleAuthorized("admin"), deleteOrder);


module.exports = router;