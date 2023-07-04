import React, { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField';
import { Field, Form, Formik } from 'formik'
import * as yup from 'yup'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '../Loader';
import { useAlert } from 'react-alert'
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { clear_errors, resetPassword } from '../../features/user/forgotPasswordSlice';
import MetaData from '../MetaData';
import { FormHelperText, IconButton, InputAdornment, OutlinedInput } from '@mui/material';

const PasswordSchema = yup.object().shape({
    newPassword: yup
        .string()
        .min(8, 'Password must be 8 characters long')
        .matches(/[0-9]/, 'Password requires a number')
        .matches(/[a-z]/, 'Password requires a lowercase letter')
        .matches(/[A-Z]/, 'Password requires an uppercase letter')
        .matches(/[^\w]/, 'Password requires a symbol')
        .required("required"),
    confirmPassword: yup
        .string()
        .min(8, 'Password must be 8 characters long')
        .matches(/[0-9]/, 'Password requires a number')
        .matches(/[a-z]/, 'Password requires a lowercase letter')
        .matches(/[A-Z]/, 'Password requires an uppercase letter')
        .matches(/[^\w]/, 'Password requires a symbol')
        .required("required"),
})

const ResetPassword = () => {
    const { token } = useParams()
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const resetPasswordSubmit = (values, actions) => {
        const myForm = new FormData();
        myForm.set("password", values.newPassword)
        myForm.set("confirmPassword", values.confirmPassword)

        // console.log(Array.from(myForm))
        // for (let obj of myForm) {
        //     console.log(obj)
        // }
        const data = {
            token,
            myForm
        }
        dispatch(resetPassword(data))
    }
    const { loading, success, error } = useSelector((state) => state.forgotPassword)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const alert = useAlert()
    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch(clear_errors())
        }
        if (success) {
            alert.success("Password Updated Successfully")
            navigate('/login')
        }
    }, [dispatch, error, success, alert, navigate])
    return (
        <>
            {/* {loading ? <Loader /> :
                <> */}
            <div className='h-screen z-10 fixed top-0 left-0 w-full bg-white'>
                <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 z-20 relative bg-white">
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                        <h2 className="mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-600">
                            Reset Password
                        </h2>
                    </div>
                    <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
                        <Formik
                            onSubmit={resetPasswordSubmit}
                            initialValues={{ newPassword: '', confirmPassword: '' }}
                            validationSchema={PasswordSchema}
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
                                        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                            New Password
                                        </label>
                                        <div className="mt-2">
                                            <OutlinedInput
                                                fullWidth
                                                size='small'
                                                type={showNewPassword ? 'text' : 'password'}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.newPassword}
                                                name='newPassword'
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={() => setShowNewPassword((show) => !show)}
                                                            edge="end"
                                                        >
                                                            {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                                error={!!touched.newPassword && !!errors.newPassword}
                                            />
                                            <FormHelperText sx={{ color: '#D32F2F', ml: '12px' }}>
                                                {touched.newPassword && errors.newPassword}
                                            </FormHelperText>
                                        </div>
                                    </div>
                                    <div className='my-6'>
                                        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                            Confirm Password
                                        </label>
                                        <div className="mt-2">
                                            <OutlinedInput
                                                fullWidth
                                                size='small'
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.confirmPassword}
                                                name='confirmPassword'
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={() => setShowConfirmPassword((show) => !show)}
                                                            edge="end"
                                                        >
                                                            {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                                error={!!touched.confirmPassword && !!errors.confirmPassword}
                                            />
                                            <FormHelperText sx={{ color: '#D32F2F', ml: '12px' }}>
                                                {touched.confirmPassword && errors.confirmPassword}
                                            </FormHelperText>
                                        </div>
                                    </div>
                                    <div>
                                        <button
                                            type="submit"
                                            className="flex w-full justify-center rounded-md bg-gradient-to-tr from-pink-500 to-violet-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                        >
                                            Update
                                        </button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
            {/* </>
            } */}
        </>
    )
}

export default ResetPassword