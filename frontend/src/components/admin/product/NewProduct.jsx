import { Box, Button, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField, colors, useMediaQuery } from '@mui/material'
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { Form, Formik } from 'formik';
import * as yup from 'yup'
import React, { useEffect, useState } from 'react'
import AdminHeader from '../AdminHeader';
import MetaData from '../../MetaData'
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from 'react-alert'
import { clearErrors, createProduct, createProductReset } from '../../../features/product/createProductSlice';
import { useNavigate } from 'react-router-dom';
import { getAllCategories } from '../../../features/product/categoriesSlice';

// const categories = ["Laptop", "SmartPhone", "Camera", "Footwear", "Shirts", "Pants"];
const sizesArray = ["XXS", "XS", "S", "M", "L", "XL", "XXL","28W x 28L", "28W x 30L", "29W x 28L", "29W x 30L", "30W x 28L", "30W x 30L", "31W x 28L", "31W x 30L", "32W x 28L", "32W x 30L", "33W x 28L", "33W x 30L", "34W x 28L", "34W x 30L"  ];
const initialValues = {
    name: "",
    description: "",
    price: Number,
    // category: "",
    stock: Number,
}
const productSchema = yup.object().shape({
    name: yup.string().required("required"),
    description: yup.string().required("required"),
    // category: yup.string().required("required"),
    price: yup.number().positive().integer().required("required"),
    stock: yup.number().positive().integer().required("required"),
})
const filter = createFilterOptions();

const NewProduct = () => {
    const isNoneMobile = useMediaQuery("(min-width: 600px)");
    const { loading, error, success } = useSelector((state) => state.newProduct)
    const { loading: categoriesLoading, categories, error: categoreisError } = useSelector((state) => state.categories)
    const dispatch = useDispatch()
    const alert = useAlert()
    const navigate = useNavigate()
    const [value, setValue] = useState('')
    const [sizes, setSizes] = useState([])
    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([])
    const imageChangeEvent = (e) => {
        const files = Array.from(e.target.files);
        setImages([]);
        setImagesPreview([]);
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagesPreview((old) => [...old, reader.result]);
                    setImages((old) => [...old, reader.result]);
                }
            }
            reader.readAsDataURL(file);
        })
    }
    const [colorImages, setColorImages] = useState([]);
    const [colorImagesPreview, setColorImagesPreview] = useState([])
    const ColorImageChangeEvent = (e) => {
        const files = Array.from(e.target.files);
        setColorImages([]);
        setColorImagesPreview([]);
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setColorImagesPreview((old) => [...old, reader.result]);
                    setColorImages((old) => [...old, reader.result]);
                }
            }
            reader.readAsDataURL(file);
        })
    }
    let categoryErrorMessage = ''
    const handleAutocompleteChange = (event, values) => {
        setSizes(values);
    };
    const handleFormSubmit = async (values, actions) => {
        const { name, description, price, category, stock } = values
        const myForm = new FormData();
        myForm.set("name", name)
        myForm.set("price", price)
        myForm.set("description", description)
        myForm.set("category", value)
        myForm.set("stock", stock)
        if (sizes.length > 0) {
            console.log(sizes)
            // myForm.set("sizes", sizes)
            const sizesObjectsArray = sizes.map(size => ({ size }));
            myForm.set("sizes", JSON.stringify(sizesObjectsArray))
        }
        images.forEach((image) => {
            myForm.append("images", image);
        })
        if (colorImages.length > 0) {
            colorImages.forEach((image) => {
                myForm.append("colors", image);
            })
        }
        if (!value) {
            categoryErrorMessage = 'required'
        } else {
            // console.log(Array.from(myForm))
            // for (let obj of myForm) {
            //     console.log(obj)
            // }
            dispatch(createProduct(myForm));
            // await new Promise((resolve) => setTimeout(resolve, 1000));
            // actions.resetForm();
            // setValue('')
        }
    }
    useEffect(() => {
        dispatch(getAllCategories());
    }, [])
    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch(clearErrors())
        }
        if (success) {
            alert.success("Product Created Successfully");
            navigate('/admin')
            dispatch(createProductReset())
        }
    }, [alert, error, success, dispatch, navigate])
    const options = categories
    // const options = ["Laptop", "SmartPhone", "Camera", "Footwear", "Shirts", "Pants"]
    return (
        <>
            <MetaData title="Create Product" />
            {/* <Box m='20px' border="4px solid red"> */}
            <div className='border-4 m-2 sm:m-5'>
                <AdminHeader title="create product" subtitle="create a new product" />
                <Formik
                    onSubmit={handleFormSubmit}
                    initialValues={initialValues}
                    validationSchema={productSchema}
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
                            <Grid container spacing={3} >
                                <Grid item md={6} width="100%">
                                    <TextField
                                        fullWidth
                                        variant='filled'
                                        type='text'
                                        label='Product Name'
                                        autoComplete='off'
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.name}
                                        name='name'
                                        error={!!touched.name && !!errors.name}
                                        helperText={touched.name && errors.name}
                                    />
                                </Grid>
                                <Grid item md={6} width="100%">
                                    <Autocomplete
                                        value={value}
                                        fullWidth
                                        onChange={(event, newValue) => {
                                            if (typeof newValue === 'string') {
                                                setValue(newValue)
                                            } else if (newValue && newValue.inputValue) {
                                                // Create a new value from the user input
                                                setValue(newValue.inputValue)
                                            } else {
                                                setValue(newValue);
                                            }
                                        }}
                                        filterOptions={(options, params) => {
                                            const filtered = filter(options, params);

                                            const { inputValue } = params;
                                            // Suggest the creation of a new value
                                            const isExisting = options.some((option) => inputValue === option.title);
                                            if (inputValue !== '' && !isExisting) {
                                                filtered.push(
                                                    inputValue
                                                );
                                            }

                                            return filtered;
                                        }}
                                        selectOnFocus
                                        clearOnBlur
                                        handleHomeEndKeys
                                        id="category"
                                        options={options}
                                        getOptionLabel={(option) => {
                                            // Value selected with enter, right from the input
                                            if (typeof option === 'string') {
                                                return option;
                                            }
                                            // Add "xxx" option created dynamically
                                            if (option.inputValue) {
                                                return option.inputValue;
                                            }
                                            // Regular option
                                            return option;
                                        }}
                                        renderOption={(props, option) => <li {...props}>{option}</li>}
                                        freeSolo
                                        renderInput={(params) => (
                                            <TextField {...params} variant='filled' label="Select or add new category" />
                                        )}
                                    />
                                    <FormHelperText sx={{ color: '#D32F2F', ml: '10px' }}>{categoryErrorMessage && categoryErrorMessage}</FormHelperText>
                                </Grid>
                                <Grid item sm={12} md={4} width="100%">
                                    <TextField
                                        fullWidth
                                        variant='filled'
                                        type='number'
                                        label='Stock'
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.stock}
                                        name='stock'
                                        error={!!touched.stock && !!errors.stock}
                                        helperText={touched.stock && errors.stock}
                                    />
                                </Grid>
                                <Grid item sm={12} md={4} width="100%">
                                    <TextField
                                        fullWidth
                                        variant='filled'
                                        type='number'
                                        label='Price'
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.price}
                                        name='price'
                                        error={!!touched.price && !!errors.price}
                                        helperText={touched.price && errors.price}
                                    />
                                </Grid>
                                <Grid item sm={12} md={4} width="100%">
                                    <Autocomplete
                                        value={sizes}
                                        multiple
                                        id="tags-standard"
                                        options={sizesArray}
                                        getOptionLabel={(option) => option}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                variant="filled"
                                                label="Select Sizes"
                                            />
                                        )}
                                        onChange={handleAutocompleteChange}
                                    />
                                    {/* <FormHelperText sx={{ color: '#D32F2F', ml: '10px' }}>{categoryErrorMessage && categoryErrorMessage}</FormHelperText> */}
                                </Grid>

                                <Grid item sm={12} width="100%">
                                    <TextField
                                        fullWidth
                                        variant='filled'
                                        type='text'
                                        multilin
                                        maxRows={3}
                                        label='Description'
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.description}
                                        name='description'
                                        error={!!touched.description && !!errors.description}
                                        helperText={touched.description && errors.description}
                                    />
                                </Grid>
                                <Grid item sm={12} lg={9} minHeight='88px' width="100%">
                                    <div style={{ border: `1px dashed ${colors.grey[600]}`, borderRadius: '8px' }} className='flex gap-2 overflow-x-auto p-2'>
                                        {imagesPreview.length > 0 ? (
                                            imagesPreview.map((image, ind) => (
                                                <div key={ind} className="aspect-w-1 min-w-[80px] overflow-hidden rounded-md h-20 cursor-pointer bg-gray-200">
                                                    <img
                                                        src={image}
                                                        alt='product colors preview'
                                                        className="h-full w-full object-contain object-center"
                                                    />
                                                </div>
                                            ))
                                        ) : (
                                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUc9A3lU2z__DzLc_FaJVc8AKs8SWRzF9ilE7Q-HAhowAjpNndg2uZKcseeYSWRRQowss&usqp=CAU" alt="Placeholder Image" className="h-20 w-20" />
                                        )}
                                    </div>
                                </Grid>

                                <Grid item sm={12} lg={3}>
                                    <Box id='product-images' sx={{
                                        '& input::-webkit-file-upload-button': {
                                            cursor: 'pointer',
                                            width: '100%',
                                            border: 'none',
                                            height: '33px',
                                            zIndex: 2,
                                            padding: '0 10px',
                                            backgroundColor: colors.grey[200],
                                            transition: 'all 0.4s'
                                        },
                                        '& input::-webkit-file-upload-button:hover': {
                                            backgroundColor: colors.grey[400]
                                        }
                                    }}>
                                        <label htmlFor="images">Select product images</label>
                                        <input type="file" name="images" accept='image/*' multiple onChange={imageChangeEvent} />
                                    </Box>
                                </Grid>
                                <Grid item sm={12} lg={9} minHeight='88px' width="100%">
                                    <div style={{ border: `1px dashed ${colors.grey[600]}`, borderRadius: '8px' }} className='flex gap-2 overflow-x-auto p-2'>
                                        {colorImagesPreview.length > 0 ? (
                                            colorImagesPreview.map((image, ind) => (
                                                <div key={ind} className="aspect-w-1 min-w-[80px] overflow-hidden rounded-md h-20 cursor-pointer bg-gray-200">
                                                    <img
                                                        src={image}
                                                        alt='product colors preview'
                                                        className="h-full w-full object-contain object-center"
                                                    />
                                                </div>
                                            ))
                                        ) : (
                                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUc9A3lU2z__DzLc_FaJVc8AKs8SWRzF9ilE7Q-HAhowAjpNndg2uZKcseeYSWRRQowss&usqp=CAU" alt="Placeholder Image" className="h-20 w-20" />
                                        )}
                                    </div>
                                </Grid>
                                <Grid item sm={12} lg={3}>
                                    <Box id='product-images' sx={{
                                        '& input::-webkit-file-upload-button': {
                                            cursor: 'pointer',
                                            width: '100%',
                                            border: 'none',
                                            height: '33px',
                                            zIndex: 2,
                                            padding: '0 10px',
                                            backgroundColor: colors.grey[200],
                                            transition: 'all 0.4s'
                                        },
                                        '& input::-webkit-file-upload-button:hover': {
                                            backgroundColor: colors.grey[400]
                                        }
                                    }}>
                                        <label htmlFor="colors">Select product colors</label>
                                        <input type="file" name="colors" accept='image/*' multiple onChange={ColorImageChangeEvent} />
                                    </Box>
                                </Grid>
                            </Grid>
                            <Box display='flex' justifyContent='end' mt='20px'>
                                <button type='submit' disabled={loading}
                                    className='min-w-[200px] h-11 flex justify-center items-center rounded-md bg-gradient-to-tr from-pink-500 to-violet-500  hover:from-pink-600 hover:to-violet-600 cursor-pointer px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-75'
                                >
                                    {loading ? <> <div class="custom-loader"></div> Creating... </> : "Create New Product"}
                                </button>
                            </Box>
                        </Form>
                    )}
                </Formik>
            {/* </Box> */}
            </div>
        </>
    )
}

export default NewProduct