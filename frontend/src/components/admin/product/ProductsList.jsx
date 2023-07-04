import React, { useEffect, useState } from 'react'
import { tokens } from '../../../theme'
import { Box, Button, IconButton, Typography, useTheme } from '@mui/material'
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
import { clearErrors, getAdminProducts } from '../../../features/product/productSlice';
import { deleteProduct, clearErrors as deletePorductClearErrors, deleteProductReset } from '../../../features/product/deleteProductSlice';
import MetaData from '../../MetaData'

const ProductsList = () => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode);
  const alert = useAlert()
  const dispatch = useDispatch()
  const { error, products } = useSelector((state) => state.product)
  const { loading, error: deleteError, isDeleted } = useSelector((state) => state.deleteProduct)

  // delete product Dialog
  const [open, setOpen] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState('');
  const handleClickOpen = (id) => {
    setProductIdToDelete(id);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const deleteProductHandler = (id) => {
    dispatch(deleteProduct(id))
  }

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (deleteError) {
      setProductIdToDelete('')
      alert.error(error);
      dispatch(deletePorductClearErrors());
    }
    if (isDeleted) {
      setProductIdToDelete('')
      setOpen(false)
      alert.success("Product Deleted Successfully");
      dispatch(deleteProductReset())
      // dispatch(getAdminProducts())
    }
    dispatch(getAdminProducts());
  }, [dispatch, alert, error, deleteError, isDeleted])

  const columns = [
    {
      field: 'id',
      headerName: 'Product ID',
      minWidth: 250,
      flex: 1
    },
    {
      field: 'name',
      headerName: 'Name',
      minWidth: 250,
      flex: 1
    },
    {
      field: 'stock',
      headerName: 'Stock',
      type: 'number',
      headerAlign: 'left',
      align: 'left',
      minWidth: 100,
      flex: 0.7
    },
    {
      field: 'price',
      headerName: 'Price',
      type: 'number',
      headerAlign: 'left',
      align: 'left',
      minWidth: 100,
      flex: 0.7
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
            <NavLink to={`/admin/product/${id}`}>
              <IconButton><EditOutlinedIcon style={{ color: colors.blueAccent[500] }} /></IconButton>
            </NavLink>
            <IconButton onClick={()=> handleClickOpen(id)}>
              <DeleteOutlineOutlinedIcon style={{ color: colors.redAccent[500] }} />
            </IconButton>
          </>
        );
      },
    },
  ]

  const rows = []
  products && products.forEach((item, index) => {
    rows.push({
      id: item._id,
      name: item.name,
      stock: item.stock,
      price: item.price,
    })
  });

  return (
    <>
      <MetaData title="All Products - Admin" />
      <Box m='20px'>
        <AdminHeader title="Products" subtitle="List of all Products" />
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
            <button onClick={() => deleteProductHandler(productIdToDelete)} className='font-semibold w-20 h-10 bg-red-600 hover:bg-red-700 text-white rounded-sm flex justify-center items-center shadow-sm'>
              {loading ? <> <div class="custom-loader-small"></div> </> : "Delete"}
              {/* <div class="custom-loader-small"></div> */}
            </button>
            {/* <Button variant='contained' onClick={handleClose}>Cancel</Button>
            <Button variant='contained' color='error' onClick={() => deleteProductHandler(id)}>Delete</Button> */}
          </DialogActions>
        </Dialog>
      </Box>
    </>
  )
}

export default ProductsList