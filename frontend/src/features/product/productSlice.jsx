import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'

const initialState = {
    loading: false, 
    products: [],
    productCount: 0,
    resultPerPage: 0,
    filteredProductsCount: 0,
    error: ''
}

export const fetchProducts = createAsyncThunk('product/fetchProducts', async ({ keyword='', currentPage=1, price=[0, 25000], category, ratings=0 , order=''} )=>{
    let link = `https://mern-ecommerce-2wa7.onrender.com/api/v1/products?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&ratings[gte]=${ratings}&order=${order}`;
    if(category){
        // link = `/api/v1/products?keyword=${keyword}&page=2&price[gte]=${price[0]}&price[lte]=${price[1]}&category=${category}&ratings[gte]=${ratings}`;
        link = `https://mern-ecommerce-2wa7.onrender.com/api/v1/products?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&category=${category}&ratings[gte]=${ratings}&order=${order}`;
    }
    // console.log("hello")
    const response = await axios.get(link);
    return response.data;
})

// get all products (Admin)
export const getAdminProducts = createAsyncThunk('products/getAdminProducts', async ()=>{
    try {
        const response = await axios.get(
          "https://mern-ecommerce-2wa7.onrender.com/api/v1/admin/products"
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

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        clearErrors: (state)=>{
            state.error = ''
        }
    },
    extraReducers: (builder)=>{
        builder.addCase(fetchProducts.pending, (state)=>{
            state.loading = true
        })
        builder.addCase(fetchProducts.fulfilled, (state, action)=>{
            state.loading = false
            state.products = action.payload.products
            state.productCount = action.payload.productCount
            state.resultPerPage = action.payload.resultPerPage
            state.filteredProductsCount = action.payload.filteredProductsCount
            state.error = ''
        })
        builder.addCase(fetchProducts.rejected, (state, action)=>{
            state.loading = false
            state.products = []
            state.error = action.error.message
        })
        // get all products (admin)
        builder.addCase(getAdminProducts.pending, (state)=>{
            state.loading = true
        })
        builder.addCase(getAdminProducts.fulfilled, (state, action)=>{
            state.loading = false
            state.products = action.payload.products
        })
        builder.addCase(getAdminProducts.rejected, (state, action)=>{
            state.loading = false
            state.error = action.error.message
        })
    }
})

export default productSlice.reducer
export const {clearErrors} = productSlice.actions