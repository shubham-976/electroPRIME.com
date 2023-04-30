const express = require("express");
const router = express.Router();
const {processPayment, sendStripeApiKey} = require("../controllers/paymentController");
const {isUserAuthenticated} = require("../middleware/authentication");

router.route("/payment/process").post(isUserAuthenticated, processPayment);
router.route("/stripeapikey").get(isUserAuthenticated, sendStripeApiKey);

module.exports = router;