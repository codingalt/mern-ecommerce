import React, { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField';
import { Field, Form, Formik } from 'formik'
import * as yup from 'yup'
import { Box, FormControl, FormHelperText, IconButton, InputAdornment, OutlinedInput } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { clear_errors, updatePassword, update_password_reset } from '../../features/user/updateProfileSlice';
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux';

const updatePasswordSchema = yup.object().shape({
    oldPassword: yup
        .string()
        .required("required"),
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

const UpdatePassword = () => {
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { loading, isUpdated, error } = useSelector((state) => state.profile)
    const updatePasswordSubmit = (values, actions) => {
        const myForm = new FormData();
        myForm.set("oldPassword", values.oldPassword)
        myForm.set("newPassword", values.newPassword)
        myForm.set("confirmPassword", values.confirmPassword)

        // console.log(Array.from(myForm))
        // for (let obj of myForm) {
        //     console.log(obj)
        // }
        dispatch(updatePassword(myForm))
    }
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const alert = useAlert()
    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch(clear_errors())
        }
        if (isUpdated) {
            alert.success("Password Updated Successfully")
            navigate('/account')
            dispatch(update_password_reset())
        }
    }, [dispatch, error, isUpdated, alert, navigate])

    return (
        <>
            {/*
            This example requires updating your template:
    
            ```
            <html class="h-full bg-white">
            <body class="h-full">
            ```
          */}
            <div className='h-screen z-10 fixed top-0 left-0 w-full bg-white'>
                <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 z-20 relative bg-white">
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                        <h2 className="mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-600">
                            Update Password
                        </h2>
                    </div>

                    <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
                        <Formik
                            onSubmit={updatePasswordSubmit}
                            initialValues={{ oldPassword: '', newPassword: '', confirmPassword: '' }}
                            validationSchema={updatePasswordSchema}
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
                                            Old Password
                                        </label>
                                        <div className="mt-2">
                                            <OutlinedInput
                                                fullWidth
                                                size='small'
                                                type={showOldPassword ? 'text' : 'password'}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.oldPassword}
                                                name='oldPassword'
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={() => setShowOldPassword((show) => !show)}
                                                            edge="end"
                                                        >
                                                            {showOldPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                                error={!!touched.oldPassword && !!errors.oldPassword}
                                            />
                                            <FormHelperText sx={{ color: '#D32F2F', ml: '12px' }}>
                                                {touched.oldPassword && errors.oldPassword}
                                            </FormHelperText>
                                        </div>
                                    </div>
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
        </>
    )
}

export default UpdatePassword