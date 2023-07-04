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
import { Form, Formik } from "formik";
import * as yup from "yup";
import React, { useEffect, useState } from "react";
import AdminHeader from "../AdminHeader";
import MetaData from "../../MetaData";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../Loader";
import { updateUser, clear_errors as updateUserClearErrors } from '../../../features/user/updateUserSlice'
import { clear_errors, getUserDetails } from '../../../features/user/userDetailsSlice'
import { update_user_reset } from "../../../features/user/updateUserSlice";

const userSchema = yup.object().shape({
    name: yup.string().required("required"),
    email: yup.string().email("Invalid email").required("required"),
    role: yup.string().oneOf(["admin", "user"], "Invalid Role").required("required"),
});

const UpdateUser = () => {
    const { id } = useParams();
    const { loading: userDetailsLoading, error, user, } = useSelector((state) => state.userDetails);
    const { loading, error: updateError, isUpdated } = useSelector((state) => state.updateUser);
    const isNoneMobile = useMediaQuery("(min-width: 600px)");
    const dispatch = useDispatch();
    const alert = useAlert();
    const navigate = useNavigate();
    const handleFormSubmit = async (values, actions) => {
        const { name, email, role } = values;
        const myForm = new FormData();
        myForm.set("name", name);
        myForm.set("email", email);
        myForm.set("role", role);
        const data = {
            id,
            myForm,
        };
        dispatch(updateUser(data));
        await new Promise((resolve) => setTimeout(resolve, 1000));
        actions.resetForm();
    };
    // useEffect(() => {
    //     dispatch(getUserDetails(id))
    // }, [])
    // console.log(user._id !== id)
    console.log(user._id !== id)
    useEffect(() => {
        if (user._id !== id) {
            dispatch(getUserDetails(id));
        }
        if (error) {
            alert.error(error);
            dispatch(clear_errors());
        }
        if (updateError) {
            alert.error(updateError);
            dispatch(updateUserClearErrors());
        }
        if (isUpdated) {
            alert.success("User updated Successfully");
            navigate("/admin/users");
            dispatch(update_user_reset());
        }
    }, [alert, error, updateError, isUpdated, dispatch, navigate, user, id]);

    return (
        <>
            {userDetailsLoading ? (
                <Loader />
            ) : (
                <>
                    <MetaData title="Update User - Admin" />
                    <Box m="20px">
                        <AdminHeader
                            title="Update user"
                            subtitle="Update user role"
                        />
                        <Formik
                            onSubmit={handleFormSubmit}
                            initialValues={{
                                name: user ? user.name : "",
                                email: user ? user.email : "",
                                role: user ? user.role : "",
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
                                <Form onSubmit={handleSubmit} encType="multipart/form-data">
                                    <Grid container spacing={3}>
                                        <Grid item sm={12} md={6}>
                                            <TextField
                                                fullWidth
                                                variant="filled"
                                                type="text"
                                                label="User Name"
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
                                                error={!!touched.role && !!errors.role}
                                            >
                                                <InputLabel id="demo-simple-select-standard-label">
                                                    User Role
                                                </InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-standard-label"
                                                    id="demo-simple-select-standard"
                                                    name="role"
                                                    value={values.role}
                                                    onChange={handleChange}
                                                    label="Role"
                                                >
                                                    <MenuItem value="">
                                                        <em>Select a Role</em>
                                                    </MenuItem>
                                                    <MenuItem value='admin'>Admin</MenuItem>
                                                    <MenuItem value='user'>User</MenuItem>
                                                </Select>
                                                <FormHelperText>
                                                    {touched.role && errors.role}
                                                </FormHelperText>
                                            </FormControl>
                                        </Grid>
                                        <Grid item sm={12} md={6}>
                                            <TextField
                                                fullWidth
                                                variant="filled"
                                                type="email"
                                                label="Email"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.email}
                                                name="email"
                                                error={!!touched.email && !!errors.email}
                                                helperText={touched.email && errors.email}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Box
                                        display="flex"
                                        justifyContent="end"
                                        mt="20px"
                                        fontSize='10px'
                                        sx={{ "& button:disabled": { opacity: "0.6" } }}
                                    >
                                        <Button
                                            disabled={loading}
                                            type="submit"
                                            color="secondary"
                                            variant="contained"
                                            size="large"

                                        >
                                            Update
                                        </Button>
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

export default UpdateUser;