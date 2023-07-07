import React, { useEffect, useState } from 'react'
import { tokens } from '../../../theme'
import { Box, IconButton, useTheme, Typography } from '@mui/material'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import AdminHeader from '../AdminHeader'
import { NavLink } from 'react-router-dom';
import { useAlert } from 'react-alert'
import { clear_errors, getAdminOrders } from '../../../features/order/ordersSlice';
import { clearErrors, deleteOrder, deleteOrderReset } from '../../../features/order/deleteOrderSlice'
import MetaData from '../../MetaData'

const OrdersList = () => {
    const theme = useTheme()
    const colors = tokens(theme.palette.mode);
    const alert = useAlert()
    const dispatch = useDispatch()
    const { error, orders } = useSelector((state) => state.orders)
    const { loading, error: deleteError, isDeleted } = useSelector((state) => state.deleteOrder)

    const [open, setOpen] = useState(false);
    const [orderIdToDelete, setOrderIdToDelete] = useState('');
    const handleClickOpen = (id) => {
        setOrderIdToDelete(id);
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const deleteOrderHandler = (id) => {
        dispatch(deleteOrder(id))
    }
    useEffect(() => {
        dispatch(getAdminOrders())
    }, [])
    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clear_errors());
        }
        if (deleteError) {
            alert.error(deleteError);
            dispatch(clearErrors());
        }
        if (isDeleted) {
            setOrderIdToDelete('')
            setOpen(false)
            alert.success("Order Deleted Successfully");
            dispatch(deleteOrderReset());
        }
        if (isDeleted || orders.length === 0) {
            dispatch(getAdminOrders());
        }
    }, [dispatch, alert, error, deleteError, isDeleted, orders.length]);

    const columns = [
        {
            field: "id",
            headerName: "Order ID",
            minWidth: 250,
            flex: 1,
        },
        {
            field: "status",
            headerName: "Status",
            minWidth: 200,
            flex: 1,
            cellClassName: (params) => {
                return params.row.status === "Delivered" ? "text-green" : "text-red";
            },
        },
        {
            field: "itemsQty",
            headerName: "Items Qty",
            type: "number",
            headerAlign: 'left',
            align: 'left',
            minWidth: 150,
            flex: 0.7,
        },
        {
            field: "amount",
            headerName: "Amount",
            type: "number",
            headerAlign: 'left',
            align: 'left',
            minWidth: 150,
            flex: 0.7,
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
                        <NavLink to={`/admin/order/${id}`}>
                            <IconButton> <EditOutlinedIcon style={{ color: colors.blueAccent[500] }} /></IconButton>
                        </NavLink>
                        <IconButton onClick={() => handleClickOpen(id)}>
                            <DeleteOutlineOutlinedIcon style={{ color: colors.redAccent[500] }} />
                        </IconButton>
                    </>
                );
            },
        },
    ]

    const rows = []
    orders && orders.forEach((item, index) => {
        rows.push({
            id: item._id,
            status: item.orderStatus,
            itemsQty: item.orderItems.length,
            amount: item.totalPrice,
        })
    });

    return (
        <>
            <MetaData title="All Orders - Admin" />
            <Box m='20px'>
                <AdminHeader title="Orders" subtitle="List of all Orders" />
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
                            <button onClick={() => deleteOrderHandler(orderIdToDelete)} className='font-semibold w-20 h-10 bg-red-600 hover:bg-red-700 text-white rounded-sm flex justify-center items-center shadow-sm'>
                                {loading ? <> <div class="custom-loader-small"></div> </> : "Delete"}
                            </button>
                        </DialogActions>
                    </Dialog>
                </Box>
            </Box>
        </>
    )
}

export default OrdersList

