import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    loading: false,
    users: [],
    error: "",
};

// get all orders (Admin)
export const getAllUsers = createAsyncThunk('user/getAllUsers', async () => {
    try {
        const response = await axios.get(
          "https://mern-ecommerce-2wa7.onrender.com/api/v1/admin/users"
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

const usersSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        clear_errors: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // get all users (admin)
        builder.addCase(getAllUsers.pending, (state) => {
            state.loading = true
        })
        builder.addCase(getAllUsers.fulfilled, (state, action) => {
            state.loading = false
            state.users = action.payload.users
        })
        builder.addCase(getAllUsers.rejected, (state, action) => {
            state.loading = false
            state.error = action.error.message
        })
    },
});

export default usersSlice.reducer;
export const { clear_errors } = usersSlice.actions;
