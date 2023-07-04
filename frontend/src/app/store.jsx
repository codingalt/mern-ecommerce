import { configureStore } from "@reduxjs/toolkit";

import productReducer from "../features/product/productSlice";
import productDetailsReducer from "../features/product/productDetailsSlice";
import userReducer from "../features/user/userSlice";
import updateProfileReducer from "../features/user/updateProfileSlice";
import forgotPasswordReducer from "../features/user/forgotPasswordSlice";
import cartReducer from "../features/cart/cartSlice";
import newOrderReducer from "../features/order/orderSlice";
import ordersReducer from "../features/order/ordersSlice";
import orderDetailsReducer from "../features/order/orderDetailsSlice";
import newReviewReducer from "../features/product/reviewSlice";
import newProductReducer from "../features/product/createProductSlice";
import deleteProductReducer from "../features/product/deleteProductSlice";
import updateProductReducer from "../features/product/updateProductSlice";
import deleteOrderReducer from "../features/order/deleteOrderSlice";
import updateOrderReducer from "../features/order/updateOrderSlice";
import usersReducer from "../features/user/usersSlice";
import deleteUserReducer from "../features/user/deleteUserSlice";
import updateUserReducer from "../features/user/updateUserSlice";
import userDetailsReducer from "../features/user/userDetailsSlice";
import productReviewsReducer from "../features/product/productReviewsSlice";
import deleteReviewReducer from "../features/product/deleteReviewSlice";
import categoriesReducer from "../features/product/categoriesSlice";
import summaryReducer from "../features/summary/summarySlice";

const store = configureStore({
  reducer: {
    product: productReducer,
    productDetails: productDetailsReducer,
    user: userReducer,
    profile: updateProfileReducer,
    forgotPassword: forgotPasswordReducer,
    cart: cartReducer,
    newOrder: newOrderReducer,
    orders: ordersReducer,
    orderDetails: orderDetailsReducer,
    newReview: newReviewReducer,
    newProduct: newProductReducer,
    deleteProduct: deleteProductReducer,
    updateProduct: updateProductReducer,
    deleteOrder: deleteOrderReducer,
    updateOrder: updateOrderReducer,
    users: usersReducer,
    deleteUser: deleteUserReducer,
    updateUser: updateUserReducer,
    userDetails: userDetailsReducer,
    productReviews: productReviewsReducer,
    deleteReview: deleteReviewReducer,
    categories: categoriesReducer,
    summary: summaryReducer
  },
});

export default store;
