import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    loading: false,
    isUpdated: false,
    error: ''
}

// update profile
export const updateProfile = createAsyncThunk('user/updateProfile', async (data)=>{
    const config = {headers: {'Content-Type': 'multipart/form-data'}, withCredentials: true};
    try {
        const response = await axios.put(
          "https://mern-ecommerce-2wa7.onrender.com/api/v1/me/update",
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

export const updatePassword = createAsyncThunk('user/updatePassword', async (passwords)=>{
    const config = {headers: {'Content-Type': 'application/json'}, withCredentials: true};
    try {
        const response = await axios.put(
          "https://mern-ecommerce-2wa7.onrender.com/api/v1/password/update",
          passwords,
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


const updateProfileSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        update_profile_reset: (state)=>{
            state.isUpdated = false
        },
        update_password_reset: (state)=>{
            state.isUpdated = false
        },
        clear_errors: (state)=>{
            state.error = null
        }
    },
    extraReducers: (builder)=>{
        builder.addCase(updateProfile.pending, (state, action)=>{
            state.loading = true
        })
        builder.addCase(updateProfile.fulfilled, (state, action)=>{
            state.loading = false
            state.isUpdated = action.payload.success
        })
        builder.addCase(updateProfile.rejected, (state, action)=>{
            state.loading = false
            state.error = action.error.message
        })
        // update password
        builder.addCase(updatePassword.pending, (state, action)=>{
            state.loading = true
        })
        builder.addCase(updatePassword.fulfilled, (state, action)=>{
            state.loading = false
            state.isUpdated = action.payload.success
        })
        builder.addCase(updatePassword.rejected, (state, action)=>{
            state.loading = false
            state.error = action.error.message
        })
    }
})

export default updateProfileSlice.reducer
export const {update_profile_reset, update_password_reset, clear_errors} = updateProfileSlice.actions