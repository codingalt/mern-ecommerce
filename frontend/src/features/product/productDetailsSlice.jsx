import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
    loading: true,
    product: {},
    relatedProducts: [],
    error: ''
}

export const fetchProductDetails =  createAsyncThunk('product/fetchProductDetails', async (id)=>{
    const response = await axios.get(
      `https://mern-ecommerce-2wa7.onrender.com/api/v1/product/${id}`
    );
    return response.data;
})

const productDetailsSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        clearErrors: (state)=>{
            state.error = ''
        }
    },
    extraReducers: (builder)=>{
        builder.addCase(fetchProductDetails.pending, (state)=>{
            state.loading = true
        })
        builder.addCase(fetchProductDetails.fulfilled, (state, action)=>{
            state.loading = false
            state.product = action.payload.product
            state.relatedProducts = action.payload.relatedProducts
        })
        builder.addCase(fetchProductDetails.rejected, (state, action)=>{
            state.loading = false
            state.product = {}
            state.error = action.error.message
        })
    }
})

export default productDetailsSlice.reducer
export const {clearErrors} = productDetailsSlice.actions