import React, { useEffect, useState } from 'react'
import Home from './components/Home'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Login from './components/user/Login'
import Register from './components/user/Register'
import ProductDetails from './components/product/ProductDetails'
import Products from './components/product/Products'
import store from './app/store'
import { loadUser } from './features/user/userSlice'
import ProtectedRoute from './route/ProtectedRoute'
import DashboardApp from './components/admin/DashboardApp'
import Dashboard from './components/admin/Dashboard'
import ProductsList from './components/admin/product/ProductsList'
import NewProduct from './components/admin/product/NewProduct'
import UpdateProduct from './components/admin/product/UpdateProduct'
import OrdersList from './components/admin/order/OrdersList'
import ProcessOrder from './components/admin/order/ProcessOrder'
import UsersList from './components/admin/user/UsersList'
import UpdateUser from './components/admin/user/UpdateUser'
import ProductReviews from './components/admin/product/ProductReviews'
import PieChart from './components/admin/charts/PieChart'
import LineChart from './components/admin/charts/LineChart'
import Cart from './components/cart/Cart'
import Shipping from './components/cart/Shipping'
import ConfirmOrder from './components/cart/ConfirmOrder'
import axios from 'axios'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import Payment from './components/cart/Payment'
import OrderSuccess from './components/cart/OrderSuccess'
import MyOrders from './components/order/MyOrders'
import OrderDetails from './components/order/OrderDetails'
import Profile from './components/user/Profile'
import UpdateProfile from './components/user/UpdateProfile'
import Footer from './components/Footer'
import UpdatePassword from './components/user/UpdatePassword'
import ForgotPassword from './components/user/ForgotPassword'
import ResetPassword from './components/user/ResetPassword'
import Bar from './components/admin/chartScenes/Bar'
import ChatBox from './components/ChatBox'
import { useSelector } from 'react-redux'
import SupportScreen from './components/admin/SupportScreen'
import NotFound from './components/NotFound'

const App = () => {
  const { pathname } = useLocation();
  const showHeaderAndFooter = !(pathname.startsWith('/admin'))
  const [stripeApiKey, setStripeApiKey] = useState("")
  async function getStripeApiKey() {
    const token = JSON.parse(localStorage.getItem('token'));
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
      },
      // withCredentials: true
    };
    const { data } = await axios.get(
      "https://mern-ecommerce-2wa7.onrender.com/api/v1/stripeapikey",
      config
    );
    setStripeApiKey(data.stripeApiKey)
  }
  const { loading, isAuthenticated, user, error } = useSelector((state) => state.user)
  useEffect(() => {
    store.dispatch(loadUser());
    getStripeApiKey()
  }, [])
  console.log(stripeApiKey)
  return (
    <>
      {/* {showHeaderAndFooter && <Navbar />} */}
      {showHeaderAndFooter && <Navbar />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/products' element={<Products />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/account' element={<Profile />}></Route>
        <Route path="me/update" element={<UpdateProfile />}></Route>
        <Route path="/password/update" element={<UpdatePassword />}></Route>
        <Route path="/password/forgot" element={<ForgotPassword />}></Route>
        <Route path="/password/reset/:token" element={<ResetPassword />}></Route>
        {/* <Route path='/product' element={<ProductDetails />} /> */}
        <Route path='/product/:id' element={<ProductDetails />} />
        <Route path='/products' element={<Products />}></Route>
        <Route path='/products/:keyword' element={<Products />}></Route>
        <Route path='/cart' element={<Cart />}></Route>
        <Route path='/shipping' element={<Shipping />}></Route>
        <Route exact path="/order/confirm" element={<ConfirmOrder />}></Route>
        {stripeApiKey && (
          <Route path="/process/payment" element={<Elements stripe={loadStripe(stripeApiKey)}><Payment /></Elements>}></Route>
        )}
        <Route exact path="/success" element={<OrderSuccess />}></Route>
        <Route exact path="/orders" element={<MyOrders />}></Route>
        <Route path='/order/:id' element={<OrderDetails />} ></Route>
        {/* admin routes */}
        <Route path='/admin' element={<ProtectedRoute isAdmin={true}><DashboardApp /></ProtectedRoute>}>
          <Route path='/admin/' element={<ProtectedRoute isAdmin={true}><Dashboard /></ProtectedRoute>} />
          <Route path='/admin/products' element={<ProtectedRoute isAdmin={true}><ProductsList /></ProtectedRoute>} />
          <Route path='/admin/product' element={<ProtectedRoute isAdmin={true}><NewProduct /></ProtectedRoute>} />
          <Route path='/admin/product/:id' element={<ProtectedRoute isAdmin={true}><UpdateProduct /></ProtectedRoute>} />
          <Route path='/admin/orders' element={<ProtectedRoute isAdmin={true}><OrdersList /></ProtectedRoute>} />
          <Route path='/admin/order/:id' element={<ProtectedRoute isAdmin={true}><ProcessOrder /></ProtectedRoute>} />
          <Route path='/admin/users' element={<ProtectedRoute isAdmin={true}><UsersList /></ProtectedRoute>} />
          <Route path='/admin/user/:id' element={<ProtectedRoute isAdmin={true}><UpdateUser /></ProtectedRoute>} />
          <Route path='/admin/reviews' element={<ProtectedRoute isAdmin={true}><ProductReviews /></ProtectedRoute>} />
          <Route path='/admin/pie' element={<ProtectedRoute isAdmin={true}><PieChart /></ProtectedRoute>} />
          <Route path='/admin/line' element={<ProtectedRoute isAdmin={true}><LineChart /></ProtectedRoute>} />
          <Route path='/admin/bar' element={<ProtectedRoute isAdmin={true}><Bar /></ProtectedRoute>} />
          <Route path='/admin/support' element={<ProtectedRoute isAdmin={true}><SupportScreen /></ProtectedRoute>} />
        </Route>
        <Route path='*' element={<NotFound />}></Route>
      </Routes>
      {!loading && user && user.role !== 'admin' && <ChatBox userInfo={user} />}
      {showHeaderAndFooter && <Footer />}
    </>
  )
}

export default App