import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    loading: false,
    isUpdated: false,
    error: ''
}

// update profile
export const updateProduct = createAsyncThunk('user/updateProduct', async (data)=>{
    const config = {headers: {'Content-Type': 'multipart/form-data'}, withCredentials: true};
    try {
        const response = await axios.put(
          `https://mern-ecommerce-2wa7.onrender.com/api/v1/admin/product/${data.id}`,
          data.myForm,
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

const updateProductSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        update_product_reset: (state)=>{
            state.isUpdated = false
        },
        clear_errors: (state)=>{
            state.error = null
        }
    },
    extraReducers: (builder)=>{
        builder.addCase(updateProduct.pending, (state, action)=>{
            state.loading = true
        })
        builder.addCase(updateProduct.fulfilled, (state, action)=>{
            state.loading = false
            state.isUpdated = action.payload.success
        })
        builder.addCase(updateProduct.rejected, (state, action)=>{
            state.loading = false
            state.error = action.error.message
        })
    }
})

export default updateProductSlice.reducer
export const {update_product_reset, clear_errors} = updateProductSlice.actions