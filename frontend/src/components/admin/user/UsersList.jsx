import React, { useEffect } from 'react'
import { tokens } from '../../../theme'
import { Box, IconButton, useTheme } from '@mui/material'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { useDispatch, useSelector } from 'react-redux';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import AdminHeader from '../AdminHeader'
import { NavLink } from 'react-router-dom';
import { useAlert } from 'react-alert'
import { clear_errors, getAllUsers } from '../../../features/user/usersSlice';
import { deleteUser, clearErrors, deleteUserReset } from '../../../features/user/deleteUserSlice';
import MetaData from '../../MetaData'

const UsersList = () => {
    const theme = useTheme()
    const colors = tokens(theme.palette.mode);
    const alert = useAlert()
    const dispatch = useDispatch()
    const { loading, error, users } = useSelector((state) => state.users)
    const { error: deleteError, isDeleted } = useSelector((state) => state.deleteUser)
    const deleteUserHandler = (id) => {
        dispatch(deleteUser(id))
    }
    useEffect(() => {
        dispatch(getAllUsers())
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
            alert.success("User Deleted Successfully");
            dispatch(deleteUserReset());
        }
        if (isDeleted || users.length === 0) {
            dispatch(getAllUsers());
        }
    }, [dispatch, alert, error, deleteError, isDeleted, users.length]);

    const columns = [
        {
            field: 'id',
            headerName: 'User ID',
            minWidth: 250,
            flex: 1
        },
        {
            field: 'name',
            headerName: 'Name',
            minWidth: 200,
            flex: 0.8
        },
        {
            field: 'email',
            headerName: 'Email',
            minWidth: 250,
            flex: 0.8
        },
        {
            field: 'role',
            headerName: 'Role',
            minWidth: 100,
            flex: 0.5,
            cellClassName: (params) => {
                return params.row.role === "admin" ? "text-green" : "text-red";
            },
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
                        <NavLink to={`/admin/user/${id}`}>
                            <IconButton><EditOutlinedIcon style={{ color: colors.blueAccent[500] }} /></IconButton>
                        </NavLink>
                        <IconButton onClick={() => deleteUserHandler(id)}>
                            <DeleteOutlineOutlinedIcon style={{ color: colors.redAccent[500] }} />
                        </IconButton>
                    </>
                );
            },
        },
    ]

    const rows = []
    users && users.forEach((item, index) => {
        rows.push({
            id: item._id,
            name: item.name,
            email: item.email,
            role: item.role,
        })
    });

    return (
        <>
            <MetaData title="All Users - Admin" />
            <Box m='20px'>
                <AdminHeader title="Users" subtitle="List of all users" />
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
            </Box>
        </>
    )
}

export default UsersList