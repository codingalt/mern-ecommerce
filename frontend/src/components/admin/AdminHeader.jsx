import { Box, Typography, useTheme } from '@mui/material'
import React from 'react'
import { tokens } from '../../theme';

const AdminHeader = ({title, subtitle}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode)
    return (
        <Box mb="30px">
            <Typography variant='h2' color={colors.grey[100]} fontWeight='bold' sx={{mb: '5px'}} textTransform='uppercase'>
                {title}
            </Typography>
            <Typography variant='h5' color={colors.grey[400]} textTransform='capitalize'>{subtitle}</Typography>
        </Box>
    )
}

export default AdminHeader