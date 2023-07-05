import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    loading: false,
    reviews: [],
    error: "",
};

// get all Reviews (Admin)
export const getAllReviews = createAsyncThunk('user/getAllReviews', async (productId) => {
    try {
        const response = await axios.get(
          `https://mern-ecommerce-2wa7.onrender.com/api/v1/reviews?id=${productId}`
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

const productReviewsSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        clear_errors: (state) => {
            state.error = null;
        },
        reviews_reset: (state) => {
            state.reviews = []
        },
    },
    extraReducers: (builder) => {
        // get product reviews (admin)
        builder.addCase(getAllReviews.pending, (state) => {
            state.loading = true
        })
        builder.addCase(getAllReviews.fulfilled, (state, action) => {
            state.loading = false
            state.reviews = action.payload.reviews
        })
        builder.addCase(getAllReviews.rejected, (state, action) => {
            state.loading = false
            state.error = action.error.message
        })
    },
});

export default productReviewsSlice.reducer;
export const { clear_errors, reviews_reset } = productReviewsSlice.actions;
