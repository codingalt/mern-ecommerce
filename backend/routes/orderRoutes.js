const express = require("express");
const { newOrder, getSingleOrder, myOrders, getAllOrders, updateOrder, deleteOrder, ordersSummary } = require("../controllers/orderController");
const { isAuthenticatedUser, autherizeRoles } = require("../models/auth");

const router = express.Router();

router.route("/order/new").post(isAuthenticatedUser, newOrder);
router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);
router.route("/orders/me").get(isAuthenticatedUser, myOrders);
router.route("/admin/orders").get(isAuthenticatedUser, autherizeRoles("admin"), getAllOrders);
router.route("/admin/order/:id").put(isAuthenticatedUser, autherizeRoles("admin"), updateOrder).delete(isAuthenticatedUser, autherizeRoles("admin"), deleteOrder);
router.route("/admin/summary").get(isAuthenticatedUser, autherizeRoles("admin"), ordersSummary);

module.exports = router;