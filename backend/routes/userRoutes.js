const express = require("express");
const { registerUser, loginUser, logoutUser, forgtoPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getAllUsers, getSigleUser, updateUserRole, deleteUser } = require("../controllers/userController");
const { isAuthenticatedUser, autherizeRoles } = require("../models/auth");
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgtoPassword);
router.route("/password/reset/:token").put(resetPassword)
router.route("/logout").get(logoutUser);
router.route("/me").get(isAuthenticatedUser, getUserDetails)
router.route("/password/update").put(isAuthenticatedUser, updatePassword);
router.route("/me/update").put(isAuthenticatedUser, updateProfile);
router.route("/admin/users").get(isAuthenticatedUser, autherizeRoles("admin"), getAllUsers);
router.route("/admin/user/:id").get(isAuthenticatedUser, autherizeRoles("admin"), getSigleUser).put(isAuthenticatedUser, autherizeRoles("admin"), updateUserRole).delete(isAuthenticatedUser, autherizeRoles("admin"), deleteUser);

module.exports = router;