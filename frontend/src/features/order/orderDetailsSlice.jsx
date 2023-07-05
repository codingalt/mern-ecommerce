import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    loading: true,
    order: {},
    error: ''
}

export const getOrderDetails = createAsyncThunk('order/getOrderDetails', async (id) => {
    try {
        const response = await axios.get(
          `https://mern-ecommerce-2wa7.onrender.com/api/v1/order/${id}`
        );
        return response.data;
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

const orderDetailsSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        clear_errors: (state) => {
            state.error = ''
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getOrderDetails.pending, (state, action) => {
            state.loading = true
        })
        builder.addCase(getOrderDetails.fulfilled, (state, action) => {
            state.loading = false
            state.order = action.payload.order
        })
        builder.addCase(getOrderDetails.rejected, (state, action) => {
            state.loading = false
            state.error = action.error.message
        })
    }
})


export default orderDetailsSlice.reducer
export const { clear_errors } = orderDetailsSlice.actions