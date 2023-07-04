import React, { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useParams } from "react-router-dom";
import { clear_errors, getOrderDetails } from "../../features/order/orderDetailsSlice";
import { newReview, clear_errors as reviewClearErrors, review_reset } from '../../features/product/reviewSlice'
import Loader from "../Loader";
import MetaData from "../MetaData";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import Rating from '@mui/material/Rating';

const OrderDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const alert = useAlert();
    const { loading, error, order } = useSelector((state) => state.orderDetails);
    const { success, error: reviewError } = useSelector(state => state.newReview)
    // const address = `${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state}, ${order.shippingInfo.pinCode}, ${order.shippingInfo.country}`

    // Review Dialog
    const [open, setOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("")
    const [productId, setProductId] = useState("")
    const handleClickOpen = (product) => {
        setProductId(product)
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const reviewSubmitHandler = () => {
        const myForm = new FormData();
        myForm.set("rating", rating);
        myForm.set("comment", comment);
        myForm.set("productId", productId);
        dispatch(newReview(myForm));
        setOpen(false);
    }
    useEffect(() => {
        dispatch(getOrderDetails(id));
    }, [id])
    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clear_errors());
        }
        if (reviewError) {
            setProductId('')
            alert.error(reviewError);
            dispatch(reviewClearErrors())
        }
        if (success) {
            setProductId('')
            setComment('')
            setRating(0)
            alert.success("Review Submitted Successfully");
            dispatch(review_reset())
        }
        // dispatch(getOrderDetails(id));
    }, [dispatch, error, alert, reviewError, success]);

    return (
        <>
            <MetaData title="Order Details" />
            {loading ? (
                <Loader />
            ) : (
                <div className="pt-28">
                    <div className="w-[90%] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-y-8 lg:gap-x-10 pb-12">
                        {order && Object.keys(order).length > 0 ? (
                            <>
                                <div className="col-span-full lg:col-span-1">
                                    <div className='flex gap-3'>
                                        <p className="text-sm">Date: {order.createdAt.slice(0, 10)}</p>
                                        <p className="text-sm">Time: {order.createdAt.slice(11, 16)}</p>
                                    </div>
                                    <h2 className="text-lg font-semibold mb-2">Order #{order && order._id}</h2>
                                    <div className="">
                                        <h3 className='text-center pb-1 border-b border-gray-300 inline-block font-semibold'>Shipping Info</h3>
                                        <div className='pl-3 pt-3 flex flex-col gap-1.5'>
                                            <div className='flex items-center gap-1.5'>
                                                <p className='text-lg font-medium'>Name:</p>
                                                <span className='text-base'>{order.user.name}</span>
                                            </div>
                                            <div className='flex items-center gap-1.5'>
                                                <p className='text-lg font-medium'>Phone:</p>
                                                <span className='text-base'>{order.shippingInfo.phoneNo}</span>
                                            </div>
                                            <div className='flex items-center gap-1.5'>
                                                <p className='text-lg font-medium'>Address:</p>
                                                <span className='text-base'>{`${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state}, ${order.shippingInfo.pinCode}, ${order.shippingInfo.country}`}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <h3 className='text-center pb-1 border-b border-gray-300 inline-block font-semibold'>Payment</h3>
                                        <div className='pl-3 pt-3 flex flex-col gap-1.5'>
                                            <div className='flex items-center gap-1.5'>
                                                <p className='text-lg font-medium'>Payment Status:</p>
                                                <span className={`${order.paymentInfo.status === "succeeded" ? 'text-green-500' : 'text-red-500'}`}>
                                                    {order.paymentInfo.status === "succeeded"
                                                        ? "PAID"
                                                        : "NOT PAID"}
                                                </span>
                                            </div>
                                            <div className='flex items-center gap-1.5'>
                                                <p className='text-lg font-medium'>Amount:</p>
                                                <span className='text-base'>{order.totalPrice}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <h3 className='text-center pb-1 border-b border-gray-300 inline-block font-semibold'>Order Status</h3>
                                        <span className={`${order.orderStatus === "Delivered" ? 'text-green-500' : 'text-red-500'} pl-3 pt-3 block`}>
                                            {order.orderStatus}
                                        </span>
                                    </div>
                                </div>
                                <div className="col-span-full lg:col-span-1 bg-gray-50 rounded-md shadow-sm p-10 h-fit">
                                    <h3 className='text-center pb-1 border-b border-gray-300 inline-block font-semibold'>Order Items</h3>
                                    <div className='mt-3 flex flex-col pt-4'>
                                        {order && order.orderItems.map((item) => {
                                            return <div className="flex justify-between items-center border-t border-gray-200 py-6 last:border-b  last:border-gray-200 bg-white px-4 rounded-lg" key={item.product}>
                                                <div className='flex gap-3 items-center'>
                                                    <div className="aspect-w-1 min-w-[96px] md:min-w-[112px] overflow-hidden rounded-sm h-28 md:h-32 cursor-pointer bg-gray-100">
                                                        <img
                                                            src={item.color || item.image}
                                                            alt='product colors preview'
                                                            className="h-full w-full object-contain object-center"
                                                        />
                                                    </div>
                                                    <div>
                                                        <NavLink to={`/product/${item.product}`} className='text-lg font-semibold'>{item.name}</NavLink>
                                                        {item.size && <p>Size: {item.size}</p>}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-center">
                                                    <p>
                                                        {item.price} * {item.quantity} = {item.price * item.quantity}
                                                    </p>
                                                    {order && order.orderStatus === 'Delivered' &&
                                                        <button className='bg-gradient-to-tr from-pink-500 to-violet-500 text-white text-sm px-3 py-2 rounded-md font-semibold mt-1' onClick={() => handleClickOpen(item.product)}>Submit Review</button>
                                                    }
                                                </div>
                                            </div>
                                        })}
                                    </div>
                                    <Dialog open={open} onClose={handleClose}>
                                        {/* <DialogTitle>Submit Review</DialogTitle> */}
                                        <DialogTitle className='flex justify-between items-center p-3 bg-gray-100'>
                                            <p className='font-semibold text-base text-gray-500'>Submit Review</p>
                                            <button onClick={handleClose}>
                                                <CloseIcon />
                                            </button>
                                        </DialogTitle>
                                        <DialogContent style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '10px', paddingBottom: '10px' }}>
                                            <Rating
                                                name="simple-controlled"
                                                value={rating}
                                                onChange={(e) => setRating(e.target.value)}
                                                size="large"
                                            />
                                            <textarea
                                                style={{ padding: '5px' }}
                                                cols="40"
                                                rows="8"
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                            >
                                            </textarea>
                                        </DialogContent>
                                        <DialogActions>
                                            <Button color='secondary' onClick={handleClose}>Cancel</Button>
                                            <Button color='primary' onClick={reviewSubmitHandler}>Submit</Button>
                                        </DialogActions>
                                    </Dialog>
                                    <div className="text-end mt-5 px-4">
                                        <h3 className='font-semibold'>Total Price: <span className="text-orange-500 ml-2">Rs. {order.totalPrice}</span></h3>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <p>No order exist with this id</p>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};


export default OrderDetails;
