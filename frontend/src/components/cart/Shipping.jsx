import React, { useState } from 'react'
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import HomeIcon from '@mui/icons-material/Home';
import PinDropIcon from '@mui/icons-material/PinDrop';
import PhoneIcon from '@mui/icons-material/Phone';
import { Country, State, City } from 'country-state-city'
import { save_shipping_info } from '../../features/cart/cartSlice';
import { useNavigate } from 'react-router-dom';
import CheckoutSteps from './CheckoutSteps';
import { FormControl, FormHelperText, InputAdornment, MenuItem, Select, TextField } from '@mui/material';
import { Form, Formik } from "formik";
import * as yup from "yup";

const phoneRegExp = /^((\+92)?(0092)?(92)?(0)?)(3)([0-9]{9})$/gm;
const shippingSchema = yup.object().shape({
  address: yup.string().required("required"),
  state: yup.string().required("required"),
  city: yup.string().required("required"),
  pinCode: yup.number().positive().integer().required("required"),
  phoneNo: yup.string().matches(phoneRegExp, "Phone number is not valid").required("required"),
});

const Shipping = () => {
  const dispatch = useDispatch()
  const alert = useAlert()
  const navigate = useNavigate()
  const { shippingInfo } = useSelector((state) => state.cart)
  const handleFormSubmit = (values, actions) => {
    values.country = "PK"
    dispatch(save_shipping_info(values))
    navigate('/order/confirm')
  };
  return (
    <div className='pt-24 w-[95%] md:w-[94%] lg:w-[90%] mx-auto'>
      <div className='md:w-[80%] mx-auto'>
        <CheckoutSteps activeStep={0} />
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={{
            address: shippingInfo ? shippingInfo.address : '',
            // state: '',
            state: shippingInfo ? shippingInfo.state : '',
            // city: '',
            city: shippingInfo ? shippingInfo.city : '',
            pinCode: shippingInfo ? shippingInfo.pinCode : '',
            phoneNo: shippingInfo ? shippingInfo.phoneNo : '',
          }}
          validationSchema={shippingSchema}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            /* and other goodies */
          }) => (
            <Form onSubmit={handleSubmit}>
              <div className='text-center mb-5'>
                <h2 className='p-1.5 border-b-2 border-gray-300 inline-block font-semibold'>Shipping Details</h2>
              </div>
              <div className='grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6'>
                <div className="col-span-full">
                  <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                    Street address
                  </label>
                  <div className='mt-2 flex items-center'>
                    <TextField
                      fullWidth
                      variant="outlined"
                      type="text"
                      autoComplete="off"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <HomeIcon />
                          </InputAdornment>
                        ),
                      }}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.address}
                      name="address"
                      error={!!touched.address && !!errors.address}
                      helperText={touched.address && errors.address}
                    />
                  </div>
                </div>
                <div className="col-span-full md:col-span-2 md:col-start-1">
                  <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                    State / Province
                  </label>
                  <div className='mt-2'>
                    <FormControl variant="outlined" fullWidth error={!!touched.state && !!errors.state} >
                      <Select
                        name='state'
                        value={values.state}
                        onChange={handleChange}
                      >
                        <MenuItem value="">
                          <em>Select a State</em>
                        </MenuItem>
                        {State && State.getStatesOfCountry('PK').map((item) => (
                          <MenuItem key={item.isoCode} value={item.isoCode}>{item.name}</MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>{touched.state && errors.state}</FormHelperText>
                    </FormControl>
                  </div>
                </div>
                <div className="col-span-full md:col-span-2">
                  <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                    City
                  </label>
                  <div className='mt-2'>
                    <FormControl variant="outlined" fullWidth={true} error={!!touched.city && !!errors.city} >
                      <Select
                        name='city'
                        value={values.city}
                        onChange={handleChange}
                      >
                        <MenuItem value="">
                          <em>Select a City</em>
                        </MenuItem>
                        {City && City.getCitiesOfState('PK', values.state).map((item) => (
                          <MenuItem key={item.name} value={item.name}>{item.name}</MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>{touched.city && errors.city}</FormHelperText>
                    </FormControl>
                  </div>
                </div>
                <div className="col-span-full md:col-span-2">
                  <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                    ZIP / Postal code
                  </label>
                  <div className='mt-2 flex items-center'>
                    <TextField
                      fullWidth
                      variant="outlined"
                      type="number"
                      autoComplete="off"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PinDropIcon />
                          </InputAdornment>
                        ),
                      }}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.pinCode}
                      name="pinCode"
                      error={!!touched.pinCode && !!errors.pinCode}
                      helperText={touched.pinCode && errors.pinCode}
                    />
                  </div>
                </div>
                <div className="col-span-full md:col-span-2">
                  <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                    Phone Number
                  </label>
                  <div className="mt-2">
                    <TextField
                      fullWidth
                      variant="outlined"
                      type="number"
                      autoComplete="off"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneIcon />
                          </InputAdornment>
                        ),
                      }}
                      // onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.phoneNo}
                      name="phoneNo"
                      error={!!touched.phoneNo && !!errors.phoneNo}
                      helperText={touched.phoneNo && errors.phoneNo}
                    />
                  </div>
                </div>
                <div className="col-span-full flex items-center justify-end mb-8">
                  <input type="submit" value="Continue"
                    className='rounded-md bg-gradient-to-tr from-pink-500 to-violet-500  hover:from-pink-600 hover:to-violet-600 cursor-pointer px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500'
                  />
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default Shipping