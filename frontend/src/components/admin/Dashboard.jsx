import { Box, Grid, Typography, useTheme } from '@mui/material'
import React, { useEffect } from 'react'
import { tokens } from '../../theme';
import AdminHeader from './AdminHeader';
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import { useSelector, useDispatch } from 'react-redux'
import { useAlert } from 'react-alert'
import { clear_errors, getOrdersSummary } from '../../features/summary/summarySlice';
import Loader from '../Loader';
import BarChart from './charts/BarChart';
import { NavLink } from 'react-router-dom';

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode)
  const alert = useAlert()
  const dispatch = useDispatch()
  const { loading, last24hrsOrder, allOrders, allUsers, numOfProducts, recentTransactions, error } = useSelector((state) => state.summary)
  useEffect(() => {
    dispatch(getOrdersSummary());
  }, [dispatch])
  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clear_errors());
    }
  }, [dispatch, alert, error])

  return (
    loading ? <Loader /> :
      <Box m='20px'>
        <AdminHeader title='Dashboard' subtitle='Welcome to your dashboard' />
        <div
          className='grid grid-cols-1 gap-5 sm:grid-cols-12 auto-rows-[120px]'
        >
          <div
            className='col-span-full sm:col-span-6 lg:col-span-3 flex items-center justify-between py-0 px-5'
            style={{ backgroundColor: colors.primary[400] }}
          >
            <Box>
              <Typography variant='h4' sx={{ color: colors.greenAccent[500] }}>Products</Typography>
              <Typography variant='h3' m='5px 0' fontWeight='bold' sx={{ color: colors.grey[100] }}>{numOfProducts ? numOfProducts : 0}</Typography>
              <Typography sx={{ color: colors.greenAccent[500] }}>Total Products</Typography>
            </Box>
            <Box>
              <Typography
                variant='span'
                backgroundColor={colors.blueAccent[500]}
                color='white'
                padding='10px'
                display='flex'
                alignItems='center'
                justifyContent='center'
                borderRadius='100%'
              >
                <LocalMallOutlinedIcon fontSize='large' />
              </Typography>
            </Box>
          </div>
          <div
            className='col-span-full sm:col-span-6 lg:col-span-3 flex items-center justify-between py-0 px-5 relative'
            style={{ backgroundColor: colors.primary[400] }}
          >
            <Typography position='absolute' top={7} right={25} sx={{ color: colors.greenAccent[500], fontSize: '12px' }}>
              total : {allOrders[0] ? allOrders[0].numOfOrders : 0}
            </Typography>
            <Box>
              <Typography variant='h4' sx={{ color: colors.greenAccent[500] }}>Orders</Typography>
              <Typography variant='h3' m='5px 0' fontWeight='bold' sx={{ color: colors.grey[100] }}>{last24hrsOrder.length > 0 ? last24hrsOrder[0].numOfOrders : 0}</Typography>
              <Typography sx={{ color: colors.greenAccent[500] }}>Last 24 Hours</Typography>
            </Box>
            <Box>
              <Typography
                variant='span'
                backgroundColor={colors.greenAccent[500]}
                color='white'
                padding='10px'
                display='flex'
                alignItems='center'
                justifyContent='center'
                borderRadius='100%'
              >
                <ListAltOutlinedIcon fontSize='large' />
              </Typography>
            </Box>
          </div>
          <div
            className='col-span-full sm:col-span-6 lg:col-span-3 flex items-center justify-between py-0 px-5'
            style={{ backgroundColor: colors.primary[400] }}
          >
            <Box>
              <Typography variant='h4' sx={{ color: colors.greenAccent[500] }}>Users</Typography>
              <Typography variant='h3' m='5px 0' fontWeight='bold' sx={{ color: colors.grey[100] }}>{allUsers[0] ? allUsers[0].numOfUsers: 0}</Typography>
              <Typography sx={{ color: colors.greenAccent[500] }}>Total Users</Typography>
            </Box>
            <Box>
              <Typography
                variant='span'
                backgroundColor={colors.redAccent[500]}
                color='white'
                padding='10px'
                display='flex'
                alignItems='center'
                justifyContent='center'
                borderRadius='100%'
              >
                <PeopleAltOutlinedIcon fontSize='large' />
              </Typography>
            </Box>
          </div>
          <div
            className='col-span-full sm:col-span-6 lg:col-span-3 flex items-center justify-between py-0 px-5 relative'
            style={{ backgroundColor: colors.primary[400] }}
          >
            <Typography position='absolute' top={7} right={25} sx={{ color: colors.greenAccent[500], fontSize: '12px' }}>
              total : {allOrders[0] ? allOrders[0].totalSalesAmount : 0}
            </Typography>
            <Box>
              <Typography variant='h4' sx={{ color: colors.greenAccent[500] }}>Sales</Typography>
              <Typography variant='h3' m='5px 0' fontWeight='bold' sx={{ color: colors.grey[100] }}>Rs. {last24hrsOrder.length > 0 ? last24hrsOrder[0].totalSalesAmount : 0}</Typography>
              <Typography sx={{ color: colors.greenAccent[500] }}>Last 24 Hours</Typography>
            </Box>
            <Box>
              <Typography
                variant='span'
                backgroundColor='orange'
                color='white'
                padding='10px'
                display='flex'
                alignItems='center'
                justifyContent='center'
                borderRadius='100%'
              >
                <LocalMallOutlinedIcon fontSize='large' />
              </Typography>
            </Box>
          </div>
          <div
            className='row-span-2 col-span-full lg:col-span-8 p-2.5 pl-5'
            style={{ backgroundColor: colors.primary[400] }}
          >
            <Box>
              <Typography variant='h5' fontWeight='bold' color={colors.grey[100]}>
                Sales of Last 7 days
              </Typography>
            </Box>
            <div className='overflow-x-auto'>
              <div height='260px' mt='-20px' className='h-[260px] -mt-5 min-w-[650px]'>
                <BarChart isDashboard={true} />
              </div>
            </div>
          </div>
          <div
            className='row-span-2 col-span-full lg:col-span-4 overflow-auto'
            style={{ backgroundColor: colors.primary[400] }}
          >
            <Box
              p='15px'
              display='flex'
              justifyContent='space-between'
              alignItems='center'
              borderBottom={`4px solid ${colors.primary[500]}`}
              color={colors.grey[100]}
            >
              <Typography color={colors.grey[100]} variant='h5' fontWeight='600'>
                Recent Transactions
              </Typography>
            </Box>
            {recentTransactions.map((transaction, i) => {
              return (
                <NavLink to={`/admin/order/${transaction._id}`}>
                  <Box
                    key={`${transaction.txId}=${i}`}
                    p='5px 15px'
                    display='flex'
                    justifyContent='space-between'
                    alignItems='center'
                    borderBottom={`4px solid ${colors.primary[500]}`}
                  >
                    <Box>
                      <Typography color={colors.greenAccent[500]} variant='h5' fontWeight='600'>
                        {transaction._id.slice(0, 7)}...
                      </Typography>
                      <Typography color={colors.grey[100]}>{transaction.user.name}</Typography>
                    </Box>
                    <Box color={colors.grey[100]}> {transaction.createdAt.slice(0, 10)} </Box>
                    <Box color={colors.grey[100]} backgroundColor={colors.greenAccent[500]} fontWeight='600' p='5px 10px'>
                      {transaction.totalPrice}
                    </Box>
                  </Box>
                </NavLink>
              )
            })}
          </div>
        </div>
      </Box>
  )
}

export default Dashboard