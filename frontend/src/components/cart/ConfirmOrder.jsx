import React from 'react'
import { useSelector } from 'react-redux'
import { NavLink, useNavigate } from 'react-router-dom'
import MetaData from '../MetaData'
import CheckoutSteps from './CheckoutSteps'

const ConfirmOrder = () => {
    const navigate = useNavigate()
    const { shippingInfo, cartItems } = useSelector((state) => state.cart)
    const { user } = useSelector((state) => state.user)

    const subtotal = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
    const shippingCharges = subtotal > 1000 ? 0 : 200;
    // const tax = subtotal * 0.18;
    // const totalPrice = subtotal + shippingCharges + tax;
    const totalPrice = subtotal + shippingCharges;
    const address = `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.pinCode}, ${shippingInfo.country}`

    const proceedToPayment = () => {
        const data = {
            subtotal,
            shippingCharges,
            // tax,
            totalPrice,
        };
        sessionStorage.setItem("orderInfo", JSON.stringify(data))
        navigate('/process/payment')
    }

    return (
        <>
            <MetaData title="Confirm Order" />
            <div className='pt-24 w-[95%] md:w-[94%] lg:w-[90%] mx-auto'>
                <CheckoutSteps activeStep={1} />
                <div className="grid grid-cols-1 gap-20 lg:grid-cols-12 mt-10 pb-16">
                    <div className="col-span-1 lg:col-span-7">
                        <div className="">
                            <h3 className='text-center pb-1 border-b border-gray-300 inline-block font-semibold'>Shipping Info</h3>
                            <div className='pl-3 pt-3 flex flex-col gap-1.5'>
                                <div className='flex items-center gap-1.5'>
                                    <p className='text-lg font-medium'>Name:</p>
                                    <span className='text-base'>{user.name}</span>
                                </div>
                                <div className='flex items-center gap-1.5'>
                                    <p className='text-lg font-medium'>Phone:</p>
                                    <span className='text-base'>{shippingInfo.phoneNo}</span>
                                </div>
                                <div className='flex items-center gap-1.5'>
                                    <p className='text-lg font-medium'>Address:</p>
                                    <span className='text-base'>{address}</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6">
                            <h3 className='text-center pb-1 border-b border-gray-300 inline-block font-semibold'>Cart Items</h3>
                            <div className='pl-2 md:pl-3 mt-3 flex flex-col pt-4'>
                                {cartItems.map((item) => {
                                    return <div className="flex justify-between items-center border-t border-gray-200 py-6 last:border-b  last:border-gray-200" key={item.product}>
                                        <div className='flex gap-3'>
                                            <div className="aspect-w-1 min-w-[96px] md:min-w-[112px] overflow-hidden rounded-sm h-28 md:h-32 cursor-pointer bg-gray-200">
                                                <img
                                                    src={item.image}
                                                    alt='product colors preview'
                                                    className="h-full w-full object-contain object-center"
                                                />
                                            </div>
                                            <div>
                                                <NavLink to={`/product/${item.product}`} className='text-base md:text-lg font-semibold'>{item.name}</NavLink>
                                                {item.size && <p>Size: {item.size}</p>}
                                                <p className='mt-1'>
                                                    <small>Rs.</small> {item.price} * {item.quantity} = {item.price * item.quantity}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 col-span-full lg:col-span-5 p-6 rounded-lg shadow-sm flex flex-col gap-5 h-fit">
                        <h3 className='font-bold border-b border-gray-300 pb-1 inline-block mx-auto'>Order Summary</h3>
                        <div className='flex justify-between border-b border-gray-300 pb-3'>
                            <h4>Subtotal :</h4>
                            <h3>Rs. {subtotal}</h3>
                        </div>
                        <div className='flex justify-between border-b border-gray-300 pb-3'>
                            <h4>Shipping Charges :</h4>
                            <h3>{shippingCharges}</h3>
                        </div>
                        {/* <div className='flex justify-between border-b border-gray-300 pb-3'>
                            <h4>GST :</h4>
                            <h3>${tax}</h3>
                        </div> */}
                        <div className='flex justify-between border-b border-gray-300 pb-3'>
                            <h4>Total Price :</h4>
                            <h3>Rs. {totalPrice}</h3>
                        </div>
                        <button className='bg-gradient-to-tr from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 rounded-md text-white py-3 font-semibold shadow-sm' onClick={proceedToPayment}>Proceed To Payment</button>
                    </div>
                </div>
            </div>
        </>
    )
}


export default ConfirmOrder