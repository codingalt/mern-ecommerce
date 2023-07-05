import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'

const initialState = {
    loading: false,
    categories: [],
    error: ''
}

// get all categories
export const getAllCategories = createAsyncThunk('products/getAllCategories', async () => {
    try {
        const response = await axios.get(
          "https://mern-ecommerce-2wa7.onrender.com/api/v1/categories"
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

const categoriesSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        clearErrors: (state) => {
            state.error = ''
        }
    },
    extraReducers: (builder) => {
        // get all categories
        builder.addCase(getAllCategories.pending, (state) => {
            state.loading = true
        })
        builder.addCase(getAllCategories.fulfilled, (state, action) => {
            state.loading = false
            state.categories = action.payload.categories
        })
        builder.addCase(getAllCategories.rejected, (state, action) => {
            state.loading = false
            state.error = action.error.message
        })
    }
})

export default categoriesSlice.reducer
export const { clearErrors } = categoriesSlice.actions