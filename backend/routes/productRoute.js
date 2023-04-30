const { createProduct, getAllProducts, updateProduct, deleteProduct, getProductDetails, createUpdateProductReview, getProductReviews, deleteReview, getAllProductsAdmin, getRecommendedProducts } = require("../controllers/productController");

const { isUserAuthenticated, isUserRoleAuthorized } = require("../middleware/authentication");
const express = require("express");
const router = express.Router();

router.route("/admin/products").get(isUserAuthenticated, isUserRoleAuthorized("admin"), getAllProductsAdmin);
router.route("/admin/product/new").post(isUserAuthenticated, isUserRoleAuthorized("admin"), createProduct);
router.route("/products").get(getAllProducts); //series of callbacks acco to isUserAuthenticated() function
router.route("/admin/product/:id").put(isUserAuthenticated, isUserRoleAuthorized("admin"), updateProduct);
router.route("/admin/product/:id").delete(isUserAuthenticated, isUserRoleAuthorized("admin"), deleteProduct);
router.route("/product/:id").get(getProductDetails);
router.route("/review").put(isUserAuthenticated, createUpdateProductReview);
router.route("/reviews").get(getProductReviews);
router.route("/reviews").delete(isUserAuthenticated, deleteReview);
router.route("/products/recommended").get(isUserAuthenticated, getRecommendedProducts);
module.exports = router;