import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    loading: false,
    success: false,
    product: {},
    error: ''
}

// create new product (admin)
export const createProduct = createAsyncThunk('product/createProduct', async (data)=>{
    const config = {headers: {'Content-Type': 'multipart/form-data'}, withCredentials: true};
    try {
        const response = await axios.post(
          "https://mern-ecommerce-2wa7.onrender.com/api/v1/admin/product/new",
          data,
          config
        );
        return response.data
    } catch (error) {
        if (error.response) {
            // The server responded with a status code outside the range of 2xx
            const errorMessage = error.response.data.message;
            throw new Error(errorMessage);
        } else if (error.request) {
            // The request was made but no response was received
            throw new Error('No response received from server');
        } else {
            // Something happened in setting up the request that triggered an Error
            throw new Error('Error occurred while sending the request');
        }
    }
})

const createProductSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        clearErrors: (state)=>{
            state.error = null
        },
        createProductReset: (state)=>{
            state.success = false
        },
    },
    extraReducers: (builder)=>{
        builder.addCase(createProduct.pending, (state, action)=>{
            state.loading = true
        })
        builder.addCase(createProduct.fulfilled, (state, action)=>{
            state.loading = false
            state.success = action.payload.success
            state.user = action.payload.product
        })
        builder.addCase(createProduct.rejected, (state, action)=>{
            state.loading = false
            state.error = action.error.message
        })
    }
})

export default createProductSlice.reducer
export const {clearErrors, createProductReset} = createProductSlice.actions