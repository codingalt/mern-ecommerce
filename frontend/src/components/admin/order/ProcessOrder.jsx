import React, { useEffect } from 'react'
import MetaData from '../../MetaData'
import { Box, Button, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, Typography, useTheme } from '@mui/material'
import { Form, Formik } from 'formik';
import * as yup from 'yup'
import { useAlert } from 'react-alert'
import AdminHeader from '../AdminHeader';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderDetails, clear_errors } from '../../../features/order/orderDetailsSlice'
import { updateOrder, update_order_reset, clear_errors as updateOrderClearErrors } from '../../../features/order/updateOrderSlice'
import { NavLink, useParams } from 'react-router-dom';
import Loader from '../../Loader'
import { tokens } from '../../../theme';

const initialValues = {
    status: ''
}
const orderSchema = yup.object().shape({
    status: yup.string().oneOf(["Shipped", "Delivered"], "Invalid Status").required("required")
})

const ProcessOrder = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode)
    const dispatch = useDispatch()
    const alert = useAlert()
    const { id } = useParams()
    const { loading, order, error } = useSelector((state) => state.orderDetails)
    const { loading: updateOrderLoading, error: updateError, isUpdated, } = useSelector((state) => state.updateOrder);
    const handleFormSubmit = async (values, actions) => {
        const myForm = new FormData();
        myForm.set("status", values.status)
        const data = {
            id,
            myForm,
        };
        dispatch(updateOrder(data))
        await new Promise((resolve) => setTimeout(resolve, 1000));
        actions.resetForm();
    }
    // useEffect(() => {
    //     dispatch(getOrderDetails(id))
    // }, [id])
    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clear_errors());
        }
        if (updateError) {
            alert.error(updateError);
            dispatch(updateOrderClearErrors());
        }
        if (isUpdated) {
            alert.success("Status updated Successfully");
            dispatch(update_order_reset());
        }
        dispatch(getOrderDetails(id))
    }, [dispatch, alert, error, updateError, isUpdated, id])
    return (
        <>
            <MetaData title="Process Order - Admin" />
            <Box m='20px'>
                <AdminHeader title="Update Order Status" subtitle="See Order Details and update status" />
                {loading ? <Loader /> :
                    order && (
                        <Grid container spacing={4}>
                            <Grid item xs={12} md={8}>
                                <div className='flex gap-3'>
                                    <Typography>Date: {order.createdAt.slice(0, 10)}</Typography>
                                    <Typography>Time: {order.createdAt.slice(11, 16)}</Typography>
                                </div>
                                <Typography variant='h3' marginBottom='5px'>Order# {order._id}</Typography>
                                <Box mb='15px' sx={{ '& > div': { marginLeft: '10px' } }}>
                                    <Typography variant='h3' marginBottom='5px'>Shipping Info</Typography>
                                    <Box display='flex' gap='8px'>
                                        <Typography fontWeight='bold'>Name:</Typography>
                                        <Typography>{order.user.name}</Typography>
                                    </Box>
                                    <Box display='flex' gap='8px'>
                                        <Typography fontWeight='bold'>Phone#:</Typography>
                                        <Typography>{order.shippingInfo.phoneNo}</Typography>
                                    </Box>
                                    <Box display='flex' gap='8px'>
                                        <Typography fontWeight='bold'>Address:</Typography>
                                        <Typography>{`${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state}, ${order.shippingInfo.pinCode}, ${order.shippingInfo.country}`}</Typography>
                                    </Box>
                                </Box>
                                <Box mb='15px' sx={{ '& > div': { marginLeft: '10px' } }}>
                                    <Typography variant='h3' marginBottom='5px'>Payment</Typography>
                                    <Box display='flex' gap='5px'>
                                        <Typography fontWeight='bold'>Payment Status:</Typography>
                                        <Typography fontWeight='bold' color={order.paymentInfo.status === "succeeded" ? colors.greenAccent[500] : colors.redAccent[500]}>
                                            {order.paymentInfo.status === "succeeded"
                                                ? "PAID"
                                                : "NOT PAID"}
                                        </Typography>
                                    </Box>
                                    <Box display='flex' gap='8px'>
                                        <Typography fontWeight='bold'>Amount:</Typography>
                                        <Typography>{order.totalPrice}</Typography>
                                    </Box>
                                </Box>
                                <Box mb='15px' sx={{ '& > div': { marginLeft: '10px' } }}>
                                    <Typography variant='h3' marginBottom='5px'>Order Status</Typography>
                                    <Box display='flex' gap='8px'>
                                        <Typography fontWeight='bold'>Payment Status:</Typography>
                                        <Typography fontWeight='bold' color={order.orderStatus === "Delivered" ? colors.greenAccent[500] : colors.redAccent[500]}>
                                            {order.orderStatus}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box mb='15px' sx={{ '& > div': { marginLeft: '10px' } }}>
                                    <Typography variant='h3' marginBottom='10px'>Order Items</Typography>
                                    <div className='mt-3 flex flex-col pt-4'>
                                        {order.orderItems.map((item) => {
                                            return <div className="flex justify-between items-center border-t border-gray-200 py-6 last:border-b  last:border-gray-200 px-4" key={item.product}>
                                                <div className='flex gap-3 items-center'>
                                                    <div className="aspect-w-1 min-w-[96px] md:min-w-[112px] overflow-hidden rounded-sm h-28 md:h-32 cursor-pointer bg-gray-200">
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
                                                <p>
                                                    ${item.price} * {item.quantity} = ${item.price * item.quantity}
                                                </p>
                                            </div>
                                        })}
                                    </div>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Typography variant='h3' mb='20px'>Process Order</Typography>
                                <Formik
                                    onSubmit={handleFormSubmit}
                                    initialValues={initialValues}
                                    validationSchema={orderSchema}
                                >
                                    {({
                                        values,
                                        errors,
                                        touched,
                                        handleChange,
                                        handleBlur,
                                        handleSubmit,
                                        isSubmitting,
                                    }) => (
                                        <Form onSubmit={handleSubmit} encType='multipart/form-data'>
                                            <FormControl variant="filled" disabled={order.orderStatus === 'Delivered'} fullWidth={true} error={!!touched.status && !!errors.status} >
                                                <InputLabel id="status">Status</InputLabel>
                                                <Select
                                                    labelId="status"
                                                    id="demo-simple-select-standard"
                                                    name='status'
                                                    value={values.status}
                                                    onChange={handleChange}
                                                    label="Status"
                                                >
                                                    <MenuItem value="">
                                                        <em>Select Order Status</em>
                                                    </MenuItem>
                                                    {order.orderStatus === 'Processing' && <MenuItem value='Shipped'>Shipped</MenuItem>}
                                                    {order.orderStatus === 'Shipped' && <MenuItem value='Delivered'>Delivered</MenuItem>}
                                                </Select>
                                                <FormHelperText>{touched.status && errors.status}</FormHelperText>
                                            </FormControl>
                                            <button type='submit' disabled={updateOrderLoading || order.orderStatus === 'Delivered'}
                                                className='mt-5 w-full h-11 flex justify-center items-center rounded-md bg-gradient-to-tr from-pink-500 to-violet-500  hover:from-pink-600 hover:to-violet-600 cursor-pointer px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-60'
                                            >
                                                Update Status
                                            </button>
                                        </Form>
                                    )}
                                </Formik>
                            </Grid>
                        </Grid>
                    )
                }
            </Box>
        </>
    )
}

export default ProcessOrder