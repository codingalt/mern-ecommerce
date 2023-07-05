import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    loading: true,
    message: '',
    success: '',
    error: ''
}

// forgot password
export const forgotPassword = createAsyncThunk('user/forgotPassword', async (email)=>{
    const config = {headers: {'Content-Type': 'application/json'}, withCredentials: true};
    try {
        const response = await axios.post(
          "https://mern-ecommerce-2wa7.onrender.com/api/v1/password/forgot",
          email,
          config
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
// reset password
export const resetPassword = createAsyncThunk('user/resetPassword', async (data)=>{
    const {token, myForm} = data
    const config = {headers: {'Content-Type': 'application/json'}, withCredentials: true};
    try {
        const response = await axios.put(`/api/v1/password/reset/${token}`, myForm, config);
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

const forgotPasswordSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clear_errors: (state)=>{
            state.error = ''
        }
    },
    extraReducers: (builder)=>{
        builder.addCase(forgotPassword.pending, (state, action)=>{
            state.loading = true
        })
        builder.addCase(forgotPassword.fulfilled, (state, action)=>{
            state.loading = false
            state.message = action.payload.message
        })
        builder.addCase(forgotPassword.rejected, (state, action)=>{
            state.loading = false
            state.error = action.error.message
        })
        // reset password
        builder.addCase(resetPassword.pending, (state, action)=>{
            state.loading = true
        })
        builder.addCase(resetPassword.fulfilled, (state, action)=>{
            state.loading = false
            state.success = action.payload.success
        })
        builder.addCase(resetPassword.rejected, (state, action)=>{
            state.loading = false
            state.error = action.error.message
        })
    },
})

export default forgotPasswordSlice.reducer
export const { clear_errors } = forgotPasswordSlice.actions