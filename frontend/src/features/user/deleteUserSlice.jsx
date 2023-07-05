import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'

const initialState = {
    loading: false,
    isDeleted: false,
    error: ''
}

// delete product (admin)
export const deleteUser = createAsyncThunk('user/deleteUser', async (id) => {
    try {
        const response = await axios.delete(
          `https://mern-ecommerce-2wa7.onrender.com/api/v1/admin/user/${id}`
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

const deleteUserSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearErrors: (state) => {
            state.error = null
        },
        deleteUserReset: (state) => {
            state.isDeleted = false
        }
    },
    extraReducers: (builder) => {
        builder.addCase(deleteUser.pending, (state, action) => {
            state.loading = true
        })
        builder.addCase(deleteUser.fulfilled, (state, action) => {
            state.loading = false
            state.isDeleted = action.payload.success
        })
        builder.addCase(deleteUser.rejected, (state, action) => {
            state.loading = false
            state.error = action.error.message
        })
    }
})

export default deleteUserSlice.reducer
export const { clearErrors, deleteUserReset } = deleteUserSlice.actions