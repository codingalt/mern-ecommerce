import React, { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField';
import { Field, Form, Formik } from 'formik'
import * as yup from 'yup'
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Loader from '../Loader';
import { useAlert } from 'react-alert'
import { clear_errors, forgotPassword } from '../../features/user/forgotPasswordSlice';
import MetaData from '../MetaData';
import { InputAdornment } from '@mui/material';

const userSchema = yup.object().shape({
    email: yup.string().email("Invalid email").required("required"),
})

const ForgotPassword = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const alert = useAlert()
    const { loading, message, error } = useSelector((state) => state.forgotPassword)
    const handleFormSubmit = async (values, actions) => {
        const myForm = new FormData();
        myForm.set("email", values.email)

        // console.log(Array.from(myForm))
        // for (let obj of myForm) {
        //     console.log(obj)
        // }
        dispatch(forgotPassword(myForm))
    }
    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch(clear_errors())
        }
        else if (message) {
            if (!error) {
                alert.success(message)
            }
        }
    }, [dispatch, error, message, alert])
    return (
        <>
            <div className='h-screen z-10 fixed top-0 left-0 w-full bg-white'>
                <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 z-20 relative bg-white">
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                        <h2 className="mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-600">
                            Forgot Password
                        </h2>
                    </div>
                    <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
                        <Formik
                            onSubmit={handleFormSubmit}
                            initialValues={{ email: '' }}
                            validationSchema={userSchema}
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
                                    <div className='my-6'>
                                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                            Email address
                                        </label>
                                        <div className="mt-2">
                                            <TextField
                                                fullWidth
                                                size='small'
                                                variant='outlined'
                                                type='email'
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <MailOutlineIcon />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                autoComplete='off'
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.email}
                                                name='email'
                                                error={!!touched.email && !!errors.email}
                                                helperText={touched.email && errors.email}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <button
                                            type="submit"
                                            className="flex w-full justify-center rounded-md bg-gradient-to-tr from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                        >
                                            Send
                                        </button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ForgotPassword