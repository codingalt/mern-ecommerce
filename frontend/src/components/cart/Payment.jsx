import React, { useEffect, useRef } from 'react'
import MetaData from '../MetaData'
import CheckoutSteps from './CheckoutSteps'
import CreditCardIcon from '@mui/icons-material/CreditCard';
import EventIcon from '@mui/icons-material/Event';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { CardNumberElement, CardCvcElement, CardExpiryElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { clear_errors, createOrder } from '../../features/order/orderSlice';
import { remove_cart } from '../../features/cart/cartSlice';

const Payment = () => {
    const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
    const alert = useAlert()
    const stripe = useStripe()
    const elements = useElements()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { shippingInfo, cartItems } = useSelector((state) => state.cart)
    const { user } = useSelector((state) => state.user)
    const { loading, error } = useSelector((state) => state.newOrder)
    const payBtn = useRef(null)
    const paymentData = {
        amount: Math.round(orderInfo.totalPrice * 100)
    }
    const order = {
        shippingInfo,
        orderItems: cartItems,
        itemsPrice: orderInfo.subtotal,
        textPrice: orderInfo.tax,
        shippingPrice: orderInfo.shippingCharges,
        totalPrice: orderInfo.totalPrice
    }
    const submitHandler = async (e) => {
        e.preventDefault();
        payBtn.current.disabled = true;
        payBtn.current.opacity = 0.5;
        const config = { headers: { 'Content-Type': 'application/json' } };
        try {
            const { data } = await axios.post(
              "https://mern-ecommerce-2wa7.onrender.com/api/v1/payment/process",
              paymentData,
              config
            );
            const client_secret = data.client_secret;
            if (!stripe || !elements) return;
            const result = await stripe.confirmCardPayment(client_secret, {
                payment_method: {
                    card: elements.getElement(CardNumberElement),
                    billing_details: {
                        name: user.name,
                        email: user.email,
                        address: {
                            line1: shippingInfo.address,
                            city: shippingInfo.city,
                            state: shippingInfo.state,
                            postal_code: shippingInfo.postal_code,
                            country: shippingInfo.country
                        }
                    }
                }
            })

            if (result.error) {
                payBtn.current.disabled = false;
                payBtn.current.opacity = 1;
                alert.error(result.error.message)
            } else {
                if (result.paymentIntent.status === "succeeded") {
                    order.paymentInfo = {
                        id: result.paymentIntent.id,
                        status: result.paymentIntent.status
                    }
                    dispatch(createOrder(order))
                    dispatch(remove_cart())
                    navigate("/success")
                } else {
                    alert.error("There's some issue while processing payment")
                }
            }
        } catch (error) {
            payBtn.current.disabled = false;
            if (error.response) {
                // The server responded with a status code outside the range of 2xx
                const errorMessage = error.response.data.message;
                alert.error(errorMessage);
            } else if (error.request) {
                // The request was made but no response was received
                alert.error('No response received from server');
            } else {
                // Something happened in setting up the request that triggered an Error
                alert.error('Error occurred while sending the request');
            }
        }
    }
    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch(clear_errors())
        }
    }, [dispatch, error, alert])

    return (
        <>
            <div className='pt-24 pb-10'>
                <MetaData title="Payment" />
                <div className="w-[90%] lg:w-[80%] mx-auto">
                    <CheckoutSteps activeStep={2} />
                    <div className="w-full sm:w-[400px] mx-auto">
                        <div className='text-center'>
                            <h2 className='text-xl font-bold border-b border-gray-400 pb-1 inline-block mb-5'>Card Info</h2>
                        </div>
                        <form className='form' onClick={submitHandler}>
                            <div className='mt-5 flex items-center'>
                                <CreditCardIcon style={{ position: 'absolute', transform: 'translateX(10px)', fontSize: '18px', color: 'rgba(0,0,0,0.6)' }} />
                                <CardNumberElement className='w-full border border-gray-500 rounded py-3 px-10' />
                            </div>
                            <div className='mt-5 flex items-center'>
                                <EventIcon style={{ position: 'absolute', transform: 'translateX(10px)', fontSize: '18px', color: 'rgba(0,0,0,0.6)' }} />
                                <CardExpiryElement className='w-full border border-gray-500 rounded py-3 px-10' />
                            </div>
                            <div className='mt-5 flex items-center'>
                                <VpnKeyIcon style={{ position: 'absolute', transform: 'translateX(10px)', fontSize: '18px', color: 'rgba(0,0,0,0.6)' }} />
                                <CardCvcElement className='w-full border border-gray-500 rounded py-3 px-10' />
                            </div>
                            <button type='submit' ref={payBtn}
                                className='mt-5 w-full h-11 flex justify-center items-center rounded-md bg-gradient-to-tr from-pink-500 to-violet-500  hover:from-pink-600 hover:to-violet-600 cursor-pointer px-6 py-2 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-75'
                            >
                                {loading ? <> <div class="custom-loader"></div> Creating... </> : `Pay - Rs. ${orderInfo && orderInfo.totalPrice}`}
                                {/* <div class="custom-loader"></div>Processing... */}
                            </button>
                            {/* <input type="submit" value={`Pay - Rs. ${orderInfo && orderInfo.totalPrice}`} className='mt-5 w-full bg-gradient-to-tr from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 rounded-md text-white py-3 font-semibold shadow-sm cursor-pointer disabled:opacity-[0.6]' ref={payBtn} /> */}
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}


export default Payment