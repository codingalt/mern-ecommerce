import React, { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField';
import { Field, Form, Formik } from 'formik'
import * as yup from 'yup'
import { Box, FormControl, FormHelperText, IconButton, InputAdornment, OutlinedInput } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { clear_errors, login, register } from '../../features/user/userSlice';
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux';

const userSchema = yup.object().shape({
    name: yup.string()
        .matches(/^[a-zA-Z\s]+$/, "Name should contain only alphabetic characters")
        .required("required"),
    email: yup.string().email("Invalid email").required("required"),
    password: yup
        .string()
        .min(8, 'Password must be 8 characters long')
        .matches(/[0-9]/, 'Password requires a number')
        .matches(/[a-z]/, 'Password requires a lowercase letter')
        .matches(/[A-Z]/, 'Password requires an uppercase letter')
        .matches(/[^\w]/, 'Password requires a symbol')
        .required("required"),
})

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [avatar, setAvatar] = useState();
    const [avatarPreview, setAvatarPreview] = useState("/images/profile.png");
    const imageChangeEvent = (event) => {
        const reader = new FileReader();

        reader.onload = () => {
            if (reader.readyState === 2) {
                setAvatar(reader.result)
                setAvatarPreview(reader.result)
            }
        }
        reader.readAsDataURL(event.target.files[0])
    }
    const { loading, isAuthenticated, error } = useSelector((state) => state.user)
    const handleFormSubmit = async (values, actions) => {
        // console.log(values)
        const myForm = new FormData();
        myForm.set("name", values.name)
        myForm.set("email", values.email)
        myForm.set("password", values.password)
        myForm.set("avatar", avatar)
        // console.log(Array.from(myForm))
        // for (let obj of myForm) {
        //     console.log(obj)
        // }
        dispatch(register(myForm))
    }
    const navigate = useNavigate();
    const alert = useAlert()
    const dispatch = useDispatch()
    const redirect = location.search ? `/${location.search.split("=")[1]}` : "/";
    useEffect(() => {
        if (isAuthenticated) {
            navigate(redirect)
        }
        if (error) {
            alert.error(error)
            dispatch(clear_errors());
        }
    }, [isAuthenticated, error, dispatch, navigate])
    return (
        <>
            <div className='h-screen z-30 fixed top-0 left-0 w-full bg-white'>
                <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 z-20 relative bg-white">
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                        <NavLink to='/'>
                            <img
                                className="mx-auto h-10 w-auto"
                                src="/images/logo.png"
                                alt="Your Company"
                            />
                        </NavLink>
                        <h2 className="mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-600">
                            Create account
                        </h2>
                    </div>

                    <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
                        <Formik
                            onSubmit={handleFormSubmit}
                            initialValues={{ name: '', email: '', password: '' }}
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
                                    <div className='mb-6'>
                                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                            Name
                                        </label>
                                        <div className="mt-2">
                                            <TextField
                                                fullWidth
                                                size='small'
                                                variant='outlined'
                                                type='text'
                                                autoComplete='off'
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.name}
                                                name='name'
                                                error={!!touched.name && !!errors.name}
                                                helperText={touched.name && errors.name}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                            Email address
                                        </label>
                                        <div className="mt-2">
                                            <TextField
                                                fullWidth
                                                size='small'
                                                variant='outlined'
                                                type='email'
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
                                    <div className='my-6'>
                                        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                            Password
                                        </label>
                                        <div className="mt-2">
                                            <OutlinedInput
                                                fullWidth
                                                size='small'
                                                id="outlined-adornment-password"
                                                type={showPassword ? 'text' : 'password'}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.password}
                                                name='password'
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={() => setShowPassword((show) => !show)}
                                                            edge="end"
                                                        >
                                                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                                error={!!touched.password && !!errors.password}
                                            />
                                            <FormHelperText sx={{ color: '#D32F2F', ml: '12px' }}>
                                                {touched.password && errors.password}
                                            </FormHelperText>
                                        </div>
                                    </div>
                                    <div id="register-image" className='flex items-center gap-4 my-6'>
                                        <div className='flex rounded-full text-sm'>
                                            <img
                                                className="h-11 w-11 rounded-full object-cover border-2 border-gray-200"
                                                src={avatarPreview}
                                                alt="Avatar preview"
                                            />
                                        </div>
                                        <input type="file" name="avatar" accept='image/*' onChange={imageChangeEvent} />
                                    </div>
                                    <div>
                                        <button
                                            type="submit"
                                            className="flex w-full justify-center rounded-md bg-gradient-to-tr from-pink-500 to-violet-500 hover:from-pink-600-600 hover:to-violet-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:shadow-md"
                                        >
                                            Register
                                        </button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                        <p className="mt-3 text-center text-sm text-gray-500">
                            Already have an account?{' '}
                            <NavLink to="/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                                Login
                            </NavLink>
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Register