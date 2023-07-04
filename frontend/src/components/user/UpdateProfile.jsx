import React, { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField';
import { Field, Form, Formik } from 'formik'
import * as yup from 'yup'
import { NavLink, useNavigate } from 'react-router-dom';
import { clear_errors, updateProfile, update_profile_reset } from '../../features/user/updateProfileSlice';
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from '../../features/user/userSlice';
import Loader from '../Loader';

const userSchema = yup.object().shape({
    name: yup.string()
        .matches(/^[a-zA-Z\s]+$/, "Name should contain only alphabetic characters")
        .required("required"),
    email: yup.string().email("Invalid email").required("required"),
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
    const { loading: userLoading, user, error: userError } = useSelector((state) => state.user)
    const { loading, isUpdated, error } = useSelector((state) => state.profile)
    const handleFormSubmit = async (values, actions) => {
        // console.log(values)
        const myForm = new FormData();
        myForm.set("name", values.name)
        myForm.set("email", values.email)
        myForm.set("avatar", avatar)
        // console.log(Array.from(myForm))
        // for (let obj of myForm) {
        //     console.log(obj)
        // }
        dispatch(updateProfile(myForm))
    }
    const navigate = useNavigate();
    const alert = useAlert()
    const dispatch = useDispatch()
    useEffect(() => {
        if (user) {
            setAvatarPreview(user?.avatar?.url)
        }
    }, [user])
    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch(clear_errors())
        }
        if (isUpdated) {
            alert.success("Profile Updated Successfully")
            dispatch(loadUser())
            navigate('/account')
            dispatch(update_profile_reset())
        }
    }, [dispatch, error, user, isUpdated, alert, navigate])
    return (
        <>
            {userLoading ? <Loader /> :
                <div className='h-screen z-10 fixed top-0 left-0 w-full bg-white'>
                    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 relative">
                        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                            <NavLink to='/'>
                                <img
                                    className="mx-auto h-10 w-auto"
                                    src="/images/logo.png"
                                    alt="Your Company"
                                />
                            </NavLink>
                            <h2 className="mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-600">
                                Update Profile
                            </h2>
                        </div>

                        <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
                            <Formik
                                onSubmit={handleFormSubmit}
                                initialValues={{
                                    name: user ? user.name : '',
                                    email: user ? user.email : ''
                                }}
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
                                        <div id="register-image" className='flex items-center gap-4 my-6'>
                                            <div className='flex rounded-full text-sm'>
                                                <img
                                                    className="h-11 w-11 rounded-full object-cover border-2 border-gray-200"
                                                    src={avatarPreview}
                                                    alt="Avatar preview"
                                                />
                                            </div>
                                            {/* <img src={avatarPreview} alt="Avatar preview" /> */}
                                            <input type="file" name="avatar" accept='image/*' onChange={imageChangeEvent} />
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
            }
        </>
    )
}

export default Register