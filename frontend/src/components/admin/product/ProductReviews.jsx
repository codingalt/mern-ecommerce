import React, { useEffect, useState } from 'react'
import { tokens } from '../../../theme'
import { Autocomplete, Box, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Typography, useTheme } from '@mui/material'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { useDispatch, useSelector } from 'react-redux';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import AdminHeader from '../AdminHeader'
import { NavLink } from 'react-router-dom';
import { useAlert } from 'react-alert'
import { clearErrors as productsClearErrors, getAdminProducts } from '../../../features/product/productSlice';
import { clear_errors, getAllReviews, reviews_reset } from '../../../features/product/productReviewsSlice';
import { deleteReview, clearErrors, deleteReviewReset } from '../../../features/product/deleteReviewSlice';
import MetaData from '../../MetaData'
import CloseIcon from '@mui/icons-material/Close';

const UsersList = () => {
    const theme = useTheme()
    const colors = tokens(theme.palette.mode);
    const alert = useAlert()
    const dispatch = useDispatch()
    const [productId, setProductId] = useState('')
    const [productName, setProductName] = useState('')
    const { error, products } = useSelector((state) => state.product)
    const { loading, error: productReviewsError, reviews } = useSelector((state) => state.productReviews)
    const { error: deleteError, isDeleted } = useSelector((state) => state.deleteReview)

    // delete product Dialog
    const [open, setOpen] = useState(false);
    const [reviewIdToDelete, setReviewIdToDelete] = useState('');
    const handleClickOpen = (id) => {
        setReviewIdToDelete(id);
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const deleteReviewrHandler = (id) => {
        const data = {
            reviewId: id,
            productId: productId
        }
        dispatch(deleteReview(data))
    }
    const productReviewsSubmitHandler = (productId) => {
        dispatch(getAllReviews(productId))
    }

    useEffect(() => {
        dispatch(getAdminProducts())
        dispatch(reviews_reset())
    }, [])
    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(productsClearErrors());
        }
        if (productReviewsError) {
            alert.error(productReviewsError);
            dispatch(clear_errors());
        }
        if (deleteError) {
            setReviewIdToDelete('')
            alert.error(deleteError);
            dispatch(clearErrors());
        }
        if (isDeleted) {
            setReviewIdToDelete('')
            alert.success("Review Deleted Successfully");
            dispatch(deleteReviewReset());
            dispatch(getAllReviews(productId));
        }
        // if (isDeleted) {
        //     dispatch(getAllReviews(productId));
        // }
    }, [dispatch, alert, error, productReviewsError, deleteError, isDeleted, reviews.length]);

    const columns = [
        {
            field: 'id',
            headerName: 'Review ID',
            minWidth: 250,
            flex: 1
        },
        {
            field: 'user',
            headerName: 'User',
            minWidth: 200,
            flex: 0.8
        },
        {
            field: 'rating',
            headerName: 'Rating',
            type: 'number',
            headerAlign: 'left',
            align: 'left',
            minWidth: 100,
            flex: 0.8,
            cellClassName: (params) => {
                return params.row.rating >= 3 ? "text-green" : "text-red";
            },
        },
        {
            field: 'comment',
            headerName: 'Comment',
            minWidth: 350,
            flex: 1,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            sortable: false,
            flex: 0.7,
            headerAlign: 'right',
            align: 'right',
            minWidth: 100,
            renderCell: (params) => {
                const id = params.row.id;
                return (
                    <>
                        <IconButton onClick={() => handleClickOpen(id)}>
                            <DeleteOutlineOutlinedIcon style={{ color: colors.redAccent[500] }} />
                        </IconButton>
                    </>
                );
            },
        },
    ]

    const rows = []
    reviews && reviews.forEach((item, index) => {
        rows.push({
            id: item._id,
            user: item.name,
            rating: item.rating,
            comment: item.comment,
        })
    });
    let options = []
    products && products.forEach((item, index) => {
        options.push({
            id: item._id,
            name: item.name
        })
    })

    return (
        <>
            <MetaData title="All Reviews - Admin" />
            <Box m='20px'>
                <AdminHeader title="Reviews" subtitle="List of all Reviews" />
                <Box>
                    <Typography variant='h3' marginBottom='10px'>Select Product to See Reviews</Typography>
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={options}
                        sx={{ width: 350 }}
                        getOptionLabel={(option) => option.name}
                        renderInput={(params) => <TextField variant='filled' {...params} label="Product" />}
                        // value={Option}
                        onChange={(e, newValue) => {
                            setProductId(newValue.id)
                            setProductName(newValue.name)
                            productReviewsSubmitHandler(newValue.id)
                        }}
                    />
                </Box>
                {reviews && reviews.length > 0 ?
                    <>
                        <Box
                            mt='10px'
                            height='65vh'
                            sx={{
                                '& .MuiDataGrid-root': {
                                    border: 'none'
                                },
                                '& .MuiDataGrid-cell': {
                                    borderBottom: 'none'
                                },
                                '& .MuiDataGrid-columnHeaders': {
                                    borderBottom: 'none',
                                    backgroundColor: colors.blueAccent[700]
                                },
                                '& .MuiDataGrid-columnHeaderTitle': {
                                    fontSize: '15px'
                                },
                                // Middle section background color
                                '& .MuiDataGrid-virtualScroller': {
                                    backgroundColor: colors.primary[400]
                                },
                                '& .MuiDataGrid-footerContainer ': {
                                    borderTop: 'none',
                                    backgroundColor: colors.blueAccent[700]
                                },
                                '& .MuiDataGrid-toolbarContainer .MuiButton-text': {
                                    color: `${colors.grey[100]} !important`
                                },
                            }}
                        >
                            <DataGrid
                                rows={rows}
                                columns={columns}
                                slots={{
                                    toolbar: GridToolbar
                                }}
                            />
                        </Box>
                    </>
                    :
                    productId && 
                    <Typography variant='h3' marginTop='20px'>The product "{productName}" has no rewies yet</Typography>
                }
                <Dialog open={open} onClose={handleClose}
                    sx={{
                        '& .MuiPaper-root': {
                            width: '450px'
                        },
                        '& .MuiDialogTitle-root': {
                            padding: '15px 10px',
                            background: '#F8F9FA',
                            color: 'black'
                        },
                        '& .MuiDialogContent-root': {
                            padding: '25px 10px',
                            background: 'white',
                            color: 'black',
                            borderBottom: '1px solid lightGray'
                        },
                        '& .MuiDialogActions-root': {
                            padding: '12px 10px',
                            background: 'white',
                        }
                    }}
                >
                    <DialogTitle className='flex justify-between'>
                        <p className='font-semibold text-base text-gray-500'>Delete Assets</p>
                        <button onClick={handleClose}>
                            <CloseIcon />
                        </button>
                    </DialogTitle>
                    <DialogContent>
                        <Typography>Are you sure you want to delete the seleted asset?</Typography>
                    </DialogContent>
                    <DialogActions>
                        <button onClick={handleClose} className='font-semibold w-20 h-10 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-sm flex justify-center items-center shadow-sm'>Cancel</button>
                        <button onClick={() => deleteReviewrHandler(reviewIdToDelete)} className='font-semibold w-20 h-10 bg-red-600 hover:bg-red-700 text-white rounded-sm flex justify-center items-center shadow-sm'>
                            {loading ? <> <div class="custom-loader-small"></div> </> : "Delete"}
                        </button>
                    </DialogActions>
                </Dialog>
            </Box>
        </>
    )
}

export default UsersList