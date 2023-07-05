import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'

const initialState = {
    cartItems: localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems")) : [],
    shippingInfo: localStorage.getItem("shippingInfo") ? JSON.parse(localStorage.getItem("shippingInfo")) : {},
}

export const addItemsToCart = createAsyncThunk('cart/addItemsToCart', async (cartData) => {
    const { data } = await axios.get(
      `https://mern-ecommerce-2wa7.onrender.com/api/v1/product/${cartData.id}`
    );
    const item = {
        product: data.product._id,
        name: data.product.name,
        price: data.product.price,
        image: data.product.images[0].url,
        stock: data.product.stock,
        quantity: cartData.quantity,
    };

    if (cartData.color) {
        item.color = cartData.color;
    }

    if (cartData.size) {
        item.size = cartData.size;
    }

    return item;
})

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        remove_cart_item: (state, action) => {
            state.cartItems = state.cartItems.filter((i) => i.product !== action.payload)
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        },
        save_shipping_info: (state, action) => {
            state.shippingInfo = action.payload
            localStorage.setItem("shippingInfo", JSON.stringify(state.shippingInfo));
        },
        remove_cart: (state, action) => {
            state.cartItems = []
            localStorage.removeItem('cartItems');
        },
    },
    extraReducers: (builder) => {
        builder.addCase(addItemsToCart.fulfilled, (state, action) => {
            const item = action.payload;
            const isItemExist = state.cartItems.find((i) => {
                return i.product === item.product;
            })
            if (isItemExist) {
                state.cartItems = state.cartItems.map((i) => i.product === isItemExist.product ? item : i)
            } else {
                state.cartItems = [...state.cartItems, item];
            }
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        })
    }
})

export default cartSlice.reducer
export const { remove_cart_item, save_shipping_info, remove_cart } = cartSlice.actions