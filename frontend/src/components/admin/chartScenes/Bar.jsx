import { Box } from '@mui/material'
import React from 'react'
import AdminHeader from '../AdminHeader'
import BarChart from '../charts/BarChart'

const Bar = () => {
    return (
        <Box m='20px'>
            <AdminHeader title='Bar chart' subtitle='Sales of Last 15 days' />
            <div className='overflow-x-auto'>
                <div className='h-[65vh] min-w-[800px]'>
                <BarChart />
            </div>
            </div>
        </Box>
    )
}

export default Bar