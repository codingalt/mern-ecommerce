import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  loading: false,
  orders: [],
  error: "",
};

// myOrders
export const myOrders = createAsyncThunk("order/myOrders", async () => {
  try {
    const response = await axios.get(
      "https://mern-ecommerce-2wa7.onrender.com/api/v1/orders/me"
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      // The server responded with a status code outside the range of 2xx
      const errorMessage = error.response.data.message;
      throw new Error(errorMessage);
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error("No response received from server");
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error("Error occurred while sending the request");
    }
  }
});

// get all orders (Admin)
export const getAdminOrders = createAsyncThunk('products/getAdminOrders', async () => {
  try {
    const response = await axios.get(
      "https://mern-ecommerce-2wa7.onrender.com/api/v1/admin/orders"
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

const ordersSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    clear_errors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(myOrders.pending, (state, action) => {
      state.loading = true;
    })
    builder.addCase(myOrders.fulfilled, (state, action) => {
      state.loading = false;
      state.orders = action.payload.orders;
    })
    builder.addCase(myOrders.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    })
    // get all products (admin)
    builder.addCase(getAdminOrders.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getAdminOrders.fulfilled, (state, action) => {
      state.loading = false
      state.orders = action.payload.orders
    })
    builder.addCase(getAdminOrders.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message
    })
  },
});

export default ordersSlice.reducer;
export const { clear_errors } = ordersSlice.actions;
