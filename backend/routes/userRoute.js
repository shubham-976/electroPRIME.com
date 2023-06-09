const express = require("express");
const router = express.Router();
const { registerUser, loginUser, logout, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getAllUsers, getSingleUser, updateUserRole, deleteUser} = require("../controllers/userController");
const { isUserAuthenticated, isUserRoleAuthorized } = require("../middleware/authentication");

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logout);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/me").get(isUserAuthenticated, getUserDetails);
router.route("/password/update").put(isUserAuthenticated, updatePassword);
router.route("/me/update").put(isUserAuthenticated, updateProfile);
router.route("/admin/users").get(isUserAuthenticated, isUserRoleAuthorized("admin"), getAllUsers);
router.route("/admin/user/:id").get(isUserAuthenticated, isUserRoleAuthorized("admin"), getSingleUser);
router.route("/admin/user/:id").put(isUserAuthenticated, isUserRoleAuthorized("admin"), updateUserRole);
router.route("/admin/user/:id").delete(isUserAuthenticated, isUserRoleAuthorized("admin"), deleteUser);

module.exports = router;