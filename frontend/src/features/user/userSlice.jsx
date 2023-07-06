import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    loading: true,
    isAuthenticated: false,
    user: {},
    error: null
}
// login
export const login = createAsyncThunk('user/login', async (data) => {
    console.log("login api called")
    const config = { headers: { 'Content-Type': 'application/json' }, withCredentials: true };
    try {
        const response = await axios.post(
          "https://mern-ecommerce-2wa7.onrender.com/api/v1/login",
          data,
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

// register
export const register = createAsyncThunk('user/register', async (data) => {
    const config = { headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true };
    try {
        const response = await axios.post(
          "https://mern-ecommerce-2wa7.onrender.com/api/v1/register",
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
// loadUser
export const loadUser = createAsyncThunk('user/loadUser', async () => {
    try {
        const response = await axios.get(
          "https://mern-ecommerce-2wa7.onrender.com/api/v1/me"
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
// logout
export const logout = createAsyncThunk('user/logout', async () => {
    const response = await axios.get(
      "https://mern-ecommerce-2wa7.onrender.com/api/v1/logout"
    );
    return response.data
})

// get user details (Admin)
// export const getUserDetails = createAsyncThunk('user/getUserDetails', async (id) => {
//     try {
//         const response = await axios.get(`https://mern-ecommerce-2wa7.onrender.com/api/v1/admin/user/${id}`)
//         return response.data
//     } catch (error) {
//         if (error.response) {
//             // The server responded with a status code outside the range of 2xx
//             const errorMessage = error.response.data.message;
//             throw new Error(errorMessage);
//         } else if (error.request) {
//             // The request was made but no response was received
//             throw new Error('No response received from server');
//         } else {
//             // Something happened in setting up the request that triggered an Error
//             throw new Error('Error occurred while sending the request');
//         }
//     }
// })

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clear_errors: (state) => {
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder.addCase(login.pending, (state, action) => {
            state.loading = true
            // state.error = ''
        })
        builder.addCase(login.fulfilled, (state, action) => {
            state.loading = false
            state.isAuthenticated = true
            state.user = action.payload.user
            localStorage.setItem("token", JSON.stringify(action.payload.token));
        })
        builder.addCase(login.rejected, (state, action) => {
            state.loading = false
            state.isAuthenticated = false
            state.user = null
            state.error = action.error.message
        })

        builder.addCase(register.pending, (state, action) => {
            state.loading = true
        })
        builder.addCase(register.fulfilled, (state, action) => {
            state.loading = false
            state.isAuthenticated = true
            state.user = action.payload.user
        })
        builder.addCase(register.rejected, (state, action) => {
            state.loading = false
            state.isAuthenticated = false
            state.user = null
            state.error = action.error.message
        })

        builder.addCase(loadUser.pending, (state, action) => {
            state.loading = true
        })
        builder.addCase(loadUser.fulfilled, (state, action) => {
            state.loading = false
            state.isAuthenticated = true
            state.user = action.payload.user
        })
        builder.addCase(loadUser.rejected, (state, action) => {
            state.loading = false
            state.isAuthenticated = false
            state.user = null
            state.error = action.error.message
        })

        builder.addCase(logout.pending, (state) => {
            state.loading = true
        })
        builder.addCase(logout.fulfilled, (state, action) => {
            state.loading = false
            state.isAuthenticated = false
            state.user = null
        })
        builder.addCase(logout.rejected, (state, action) => {
            state.loading = false
            state.error = action.error.message
        })
        // get user Details (Admin)
        // builder.addCase(getUserDetails.pending, (state) => {
        //     state.loading = true
        // })
        // builder.addCase(getUserDetails.fulfilled, (state, action) => {
        //     state.loading = false
        //     state.user = action.payload.user
        // })
        // builder.addCase(getUserDetails.rejected, (state, action) => {
        //     state.loading = false
        //     state.error = action.error.message
        // })
    }
})


export default userSlice.reducer
export const { clear_errors } = userSlice.actions