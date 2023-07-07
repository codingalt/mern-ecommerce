import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'

const initialState = {
    loading: false,
    isDeleted: false,
    error: ''
}

// delete product (admin)
export const deleteReview = createAsyncThunk('user/deleteReview', async (data) => {
    const token = JSON.parse(localStorage.getItem('token'));
    const config = {
        headers: {
            'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
        },
    };
    try {
        const response = await axios.delete(
          `https://mern-ecommerce-2wa7.onrender.com/api/v1/reviews?id=${data.reviewId}&productId=${data.productId}`,
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

const deleteReviewSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearErrors: (state) => {
            state.error = null
        },
        deleteReviewReset: (state) => {
            state.isDeleted = false
        }
    },
    extraReducers: (builder) => {
        builder.addCase(deleteReview.pending, (state, action) => {
            state.loading = true
        })
        builder.addCase(deleteReview.fulfilled, (state, action) => {
            state.loading = false
            state.isDeleted = action.payload.success
        })
        builder.addCase(deleteReview.rejected, (state, action) => {
            state.loading = false
            state.error = action.error.message
        })
    }
})

export default deleteReviewSlice.reducer
export const { clearErrors, deleteReviewReset } = deleteReviewSlice.actions