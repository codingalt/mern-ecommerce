import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    loading: true,
    last24hrsOrder: [],
    dailyOrders: [],
    salesLast12Months: [],
    salesLast7Days: [],
    allOrders: [],
    allUsers: [],
    productCategories: [],
    numOfProducts: 0,
    recentTransactions: [],
    error: "",
};

// get orders summary (admin)
export const getOrdersSummary = createAsyncThunk('order/getOrdersSummary', async () => {
    try {
        const response = await axios.get(
          "https://mern-ecommerce-2wa7.onrender.com/api/v1/admin/summary"
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

const SummarySlice = createSlice({
    name: "order",
    initialState,
    reducers: {
        clear_errors: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // get orders summary (admin)
        builder.addCase(getOrdersSummary.pending, (state) => {
            state.loading = true
        })
        builder.addCase(getOrdersSummary.fulfilled, (state, action) => {
            state.loading = false
            state.last24hrsOrder = action.payload.last24hrsOrder
            state.dailyOrders = action.payload.dailyOrders
            state.salesLast12Months = action.payload.salesLast12Months
            state.salesLast7Days = action.payload.salesLast7Days
            state.allOrders = action.payload.allOrders
            state.allUsers = action.payload.allUsers
            state.numOfProducts = action.payload.numOfProducts
            state.productCategories = action.payload.productCategories
            state.recentTransactions = action.payload.recentTransactions
        })
        builder.addCase(getOrdersSummary.rejected, (state, action) => {
            state.loading = false
            state.error = action.error.message
        })
    },
});

export default SummarySlice.reducer;
export const { clear_errors } = SummarySlice.actions;
