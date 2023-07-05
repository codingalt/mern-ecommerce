import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
    loading: false,
    success: false,
    error: ''
}

export const newReview = createAsyncThunk('product/newReview', async (reviewData)=>{
    const config = {headers: {'Content-Type': 'application/json'}, withCredentials: true};
    try {
        const response = await axios.put(
          "https://mern-ecommerce-2wa7.onrender.com/api/v1/review",
          reviewData,
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

const reviewSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        clear_errors: (state)=>{
            state.error = ''
        },
        review_reset: (state)=>{
            state.success = false
        }
    },
    extraReducers: (builder)=>{
        builder.addCase(newReview.pending, (state)=>{
            state.loading = true
        })
        builder.addCase(newReview.fulfilled, (state, action)=>{
            state.loading = false
            state.success = action.payload.success
        })
        builder.addCase(newReview.rejected, (state, action)=>{
            state.loading = false
            state.error = action.error.message
        })
    }
})

export default reviewSlice.reducer
export const {clear_errors, review_reset} = reviewSlice.actions