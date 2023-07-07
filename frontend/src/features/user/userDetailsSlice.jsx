import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    loading: false,
    user: {},
    error: ''
}

// get user details (Admin)
export const getUserDetails = createAsyncThunk('user/getUserDetails', async (id) => {
    const token = JSON.parse(localStorage.getItem('token'));
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
      },
    };
    try {
        const response = await axios.get(
          `https://mern-ecommerce-2wa7.onrender.com/api/v1/admin/user/${id}`,
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

const userDetailsSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clear_errors: (state) => {
            state.error = null
        }
    },
    extraReducers: (builder) => {
        // get user Details (Admin)
        builder.addCase(getUserDetails.pending, (state) => {
            state.loading = true
        })
        builder.addCase(getUserDetails.fulfilled, (state, action) => {
            state.loading = false
            state.user = action.payload.user
        })
        builder.addCase(getUserDetails.rejected, (state, action) => {
            state.loading = false
            state.error = action.error.message
        })
    }
})


export default userDetailsSlice.reducer
export const { clear_errors } = userDetailsSlice.actions