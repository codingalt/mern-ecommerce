import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  loading: false,
  order: {},
  error: "",
};

export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (order) => {
    // const config = {
    //   headers: { "Content-Type": "application/json" },
    //   withCredentials: true,
    // };
    const token = JSON.parse(localStorage.getItem('token'));
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
        },
    };
    try {
      const response = await axios.post(
        "https://mern-ecommerce-2wa7.onrender.com/api/v1/order/new",
        order,
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
        throw new Error("No response received from server");
      } else {
        // Something happened in setting up the request that triggered an Error
        throw new Error("Error occurred while sending the request");
      }
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    clear_errors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createOrder.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(createOrder.fulfilled, (state, action) => {
      state.loading = false;
      state.order = action.payload;
    });
    builder.addCase(createOrder.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export default orderSlice.reducer;
export const { clear_errors } = orderSlice.actions;
