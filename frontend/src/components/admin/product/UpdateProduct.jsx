import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  colors,
  useMediaQuery,
} from "@mui/material";
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { Form, Formik } from "formik";
import * as yup from "yup";
import React, { useEffect, useState } from "react";
import AdminHeader from "../AdminHeader";
import MetaData from "../../MetaData";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { useNavigate, useParams } from "react-router-dom";
import {
  clearErrors,
  fetchProductDetails,
} from "../../../features/product/productDetailsSlice";
import {
  clear_errors,
  updateProduct,
  update_product_reset,
} from "../../../features/product/updateProductSlice";
import Loader from "../../Loader";
import { getAllCategories, clearErrors as categoriesClearErrors } from '../../../features/product/categoriesSlice'
const sizesArray = ["XXS", "XS", "S", "M", "L", "XL", "XXL","28W x 28L", "28W x 30L", "29W x 28L", "29W x 30L", "30W x 28L", "30W x 30L", "31W x 28L", "31W x 30L", "32W x 28L", "32W x 30L", "33W x 28L", "33W x 30L", "34W x 28L", "34W x 30L"  ];
const productSchema = yup.object().shape({
  name: yup.string().required("required"),
  description: yup.string().required("required"),
  category: yup.string().required("required"),
  price: yup.number().positive().integer().required("required"),
  stock: yup.number().positive().integer().required("required"),
});

const UpdateProduct = () => {
  const { id } = useParams();
  const { loading: productDetailsLoading, error, product } = useSelector((state) => state.productDetails);
  const { loading, error: updateError, isUpdated } = useSelector((state) => state.updateProduct);
  const { loading: categoriesLoading, categories, error: categoreisError } = useSelector((state) => state.categories)
  const isNoneMobile = useMediaQuery("(min-width: 600px)");
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [oldImages, setOldImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [sizes, setSizes] = useState([])
  const handleAutocompleteChange = (event, values) => {
    console.log(values)
    setSizes(values);
  };
  const imageChangeEvent = (e) => {
    const files = Array.from(e.target.files);
    setImages([]);
    setImagesPreview([]);
    setOldImages([]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((old) => [...old, reader.result]);
          setImages((old) => [...old, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };
  const [OldColorImages, setOldColorImages] = useState([]);
  const [colorImages, setColorImages] = useState([]);
  const [colorImagesPreview, setColorImagesPreview] = useState([])
  const ColorImageChangeEvent = (e) => {
    const files = Array.from(e.target.files);
    setColorImages([]);
    setColorImagesPreview([]);
    setOldColorImages([])
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
  const handleFormSubmit = async (values, actions) => {
    if (product.sizes) {
      var oldSizes = []
      for (var i = 0; i < product.sizes.length; i++) {
        oldSizes.push(product.sizes[i].size)
      }
    }
    // Check if the arrays have the same length
    if (oldSizes.length !== sizes.length) {
      console.log("Arrays have different lengths.");
    } else {
      var isEqual = true;
      // Compare each element of the arrays
      for (var i = 0; i < oldSizes.length; i++) {
        if (oldSizes[i] !== sizes[i]) {
          isEqual = false;
          break;
        }
      }
    }
    const { name, description, price, category, stock } = values;
    const myForm = new FormData();
    myForm.set("name", name);
    myForm.set("price", price);
    myForm.set("description", description);
    myForm.set("category", category);
    myForm.set("stock", stock);
    if (!isEqual) {
      // const sizesObjectsArray = sizes.map(size => ({ size }));
      myForm.set("sizes", JSON.stringify(sizes))
      // myForm.set("sizes", sizes)
    }
    images.forEach((image) => {
      myForm.append("images", image);
    });
    if (colorImages.length > 0) {
      colorImages.forEach((image) => {
        myForm.append("colors", image);
      });
    }
    const data = {
      id,
      myForm,
    };
    // for (let obj of myForm) {
    //   console.log(obj)
    // }
    dispatch(updateProduct(data));
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    // actions.resetForm();
  };
  useEffect(() => {
    dispatch(getAllCategories());
  }, [])
  useEffect(() => {
    if (product._id !== id) {
      dispatch(fetchProductDetails(id));
    } else {
      setOldImages(product.images);
      if (product.colors.length > 0) {
        setOldColorImages(product.colors)
      }
      if (product.sizes) {
        var selectedSizes = []
        for (var i = 0; i < product.sizes.length; i++) {
          selectedSizes.push(product.sizes[i].size)
        }
        setSizes(selectedSizes)
      }
    }
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (updateError) {
      alert.error(updateError);
      dispatch(clear_errors());
    }
    if (isUpdated) {
      alert.success("Product updated Successfully");
      navigate("/admin/products");
      dispatch(update_product_reset());
    }
  }, [alert, error, updateError, isUpdated, dispatch, navigate, product, id]);
  return (
    <>
      {productDetailsLoading ? (
        <Loader />
      ) : (
        <>
          <MetaData title="Update Product - Admin" />
          <Box m="20px">
            <AdminHeader
              title="Update Product"
              subtitle=""
            />
            <Formik
              onSubmit={handleFormSubmit}
              initialValues={{
                name: product ? product.name : "",
                description: product ? product.description : "",
                price: product ? product.price : 0,
                category: product ? product.category : "",
                stock: product ? product.stock : 0,
              }}
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
                /* and other goodies */
              }) => (
                <Form onSubmit={handleSubmit} encType="multipart/form-data">
                  <Grid container spacing={3}>
                    <Grid item sm={12} md={6}>
                      <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        label="Product Name"
                        autoComplete="off"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.name}
                        name="name"
                        error={!!touched.name && !!errors.name}
                        helperText={touched.name && errors.name}
                      />
                    </Grid>
                    <Grid item sm={12} md={6}>
                      <FormControl
                        variant="filled"
                        fullWidth={true}
                        error={!!touched.category && !!errors.category}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          Category
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          name="category"
                          value={values.category}
                          onChange={handleChange}
                          label="Category"
                        >
                          <MenuItem value="">
                            <em>Select a category</em>
                          </MenuItem>
                          {categories.map((cate, ind) => (
                            <MenuItem key={ind} value={cate}>
                              {cate}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText>
                          {touched.category && errors.category}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item sm={12} md={product.sizes.length > 0 ? 4 : 6}>
                      <TextField
                        fullWidth
                        variant="filled"
                        type="number"
                        label="Stock"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.stock}
                        name="stock"
                        error={!!touched.stock && !!errors.stock}
                        helperText={touched.stock && errors.stock}
                      />
                    </Grid>
                    <Grid item sm={12} md={product.sizes.length > 0 ? 4 : 6}>
                      <TextField
                        fullWidth
                        variant="filled"
                        type="number"
                        label="Price"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.price}
                        name="price"
                        error={!!touched.price && !!errors.price}
                        helperText={touched.price && errors.price}
                      />
                    </Grid>
                    {product.sizes.length > 0 &&
                      <Grid item sm={12} md={4}>
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
                    }
                    <Grid item sm={12}>
                      <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        label="Description"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.description}
                        name="description"
                        error={!!touched.description && !!errors.description}
                        helperText={touched.description && errors.description}
                      />
                    </Grid>
                    <Grid item sm={12} lg={9} minHeight='88px'>
                      <div style={{ border: `1px dashed ${colors.grey[600]}`, borderRadius: '8px' }} className='flex gap-2 overflow-x-auto p-2'>
                        {imagesPreview.length > 0 ? (
                          imagesPreview.map((image, ind) => (
                            <div key={ind} className="aspect-w-1 min-w-[80px] overflow-hidden rounded-sm h-20 cursor-pointer bg-gray-200">
                              <img
                                src={image}
                                alt='product images preview'
                                className="h-full w-full object-contain object-center"
                              />
                            </div>
                          ))
                        ) : (
                          oldImages.map((image, ind) => (
                            <div key={ind} className="aspect-w-1 min-w-[80px] overflow-hidden rounded-md h-20 cursor-pointer bg-gray-200">
                              <img
                                src={image.url}
                                alt='product images preview'
                                className="h-full w-full object-contain object-center"
                              />
                            </div>
                          ))
                          // <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUc9A3lU2z__DzLc_FaJVc8AKs8SWRzF9ilE7Q-HAhowAjpNndg2uZKcseeYSWRRQowss&usqp=CAU" alt="Placeholder Image" className="h-20 w-20" />
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
                    {product.colors.length > 0 &&
                      <>
                        <Grid item sm={12} lg={9} minHeight='88px'>
                          <div style={{ border: `1px dashed ${colors.grey[600]}`, borderRadius: '8px' }} className='flex gap-2 overflow-x-auto p-2'>
                            {colorImagesPreview.length > 0 ? (
                              colorImagesPreview.map((image, ind) => (
                                <div key={ind} className="aspect-w-1 min-w-[80px] overflow-hidden rounded-sm h-20 cursor-pointer bg-gray-200">
                                  <img
                                    src={image}
                                    alt='product colors preview'
                                    className="h-full w-full object-contain object-center"
                                  />
                                </div>
                              ))
                            ) : (
                              OldColorImages.map((image, ind) => (
                                <div key={ind} className="aspect-w-1 min-w-[80px] overflow-hidden rounded-md h-20 cursor-pointer bg-gray-200">
                                  <img
                                    src={image.url}
                                    alt='product images preview'
                                    className="h-full w-full object-contain object-center"
                                  />
                                </div>
                              ))
                              // <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUc9A3lU2z__DzLc_FaJVc8AKs8SWRzF9ilE7Q-HAhowAjpNndg2uZKcseeYSWRRQowss&usqp=CAU" alt="Placeholder Image" className="h-20 w-20" />
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
                      </>
                    }
                    
                  </Grid>
                  <Box
                    display="flex"
                    justifyContent="end"
                    mt="20px"
                    sx={{ "& button:disabled": { opacity: "0.6" } }}
                  >
                    <button type='submit' disabled={loading}
                      className='min-w-[200px] h-11 flex justify-center items-center rounded-md bg-gradient-to-tr from-pink-500 to-violet-500  hover:from-pink-600 hover:to-violet-600 cursor-pointer px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-75'
                    >
                      {loading ? <> <div class="custom-loader"></div> Updating... </> : "Update"}
                    </button>
                  </Box>
                </Form>
              )}
            </Formik>
          </Box>
        </>
      )}
    </>
  );
};

export default UpdateProduct;
