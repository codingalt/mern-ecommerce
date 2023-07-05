import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'

const initialState = {
    loading: false,
    isDeleted: false,
    error: ''
}

// delete product (admin)
export const deleteOrder = createAsyncThunk('order/deleteOrder', async (id) => {
    try {
        const response = await axios.delete(
          `https://mern-ecommerce-2wa7.onrender.com/api/v1/admin/order/${id}`
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

const deleteOrderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        clearErrors: (state) => {
            state.error = null
        },
        deleteOrderReset: (state) => {
            state.isDeleted = false
        }
    },
    extraReducers: (builder) => {
        builder.addCase(deleteOrder.pending, (state, action) => {
            state.loading = true
        })
        builder.addCase(deleteOrder.fulfilled, (state, action) => {
            state.loading = false
            state.isDeleted = action.payload.success
        })
        builder.addCase(deleteOrder.rejected, (state, action) => {
            state.loading = false
            state.error = action.error.message
        })
    }
})

export default deleteOrderSlice.reducer
export const { clearErrors, deleteOrderReset } = deleteOrderSlice.actions