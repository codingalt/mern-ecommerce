import { Box, IconButton, Typography, useTheme } from '@mui/material'
import React, { useEffect, useRef } from 'react'
import { useState } from 'react'
import { tokens } from '../../../theme'
import { Sidebar as ProSidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import PieChartOutlinedIcon from '@mui/icons-material/PieChartOutlined';
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined';
import { NavLink } from 'react-router-dom';
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import ViewModuleOutlinedIcon from '@mui/icons-material/ViewModuleOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  return (
    <MenuItem
      active={selected === title}
      style={{ color: colors.grey[100] }}
      onClick={() => setSelected(title)}
      icon={icon}
      component={<NavLink to={to} />}
    >
      <Typography>{title}</Typography>
    </MenuItem>
  )
}

const Sidebar = () => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [selected, setSelected] = useState("Dashboard")
  const [width, setWidth] = useState(window.innerWidth);
  const menuBtn = useRef(null)
  const collapseHandler = ()=>{
    if(width < 1050){
      menuBtn.current.disabled = true;
    }else{
      menuBtn.current.disabled = false;
      setIsCollapsed(!isCollapsed)
    }
  }
  function getSize() {
    setWidth(window.innerWidth)
  }
  useEffect(()=>{
    window.addEventListener('resize', getSize)
    if(width < 1050){
      setIsCollapsed(true)
    }else{
      setIsCollapsed(false)
    }
    return ()=>{
      window.removeEventListener('resize', getSize)
    }
  }, [window.innerWidth])
  return (
    <ProSidebar defaultCollapsed={isCollapsed}  backgroundColor={colors.primary[400]} >
      <Menu>
        <MenuItem
          onClick={collapseHandler} ref={menuBtn}
          icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
        >
          {!isCollapsed && (
            <Box display='flex' justifyContent='space-between' alignItems='center' ml='10px'>
              <NavLink to='/'>
                <Typography variant='h3' color={colors.grey[100]}>
                  ECOMMERCE
                </Typography>
              </NavLink>
              <IconButton onClick={()=> setIsCollapsed(!isCollapsed)}>
                <MenuOutlinedIcon />
              </IconButton>
            </Box>
          )}
        </MenuItem>

        <Box>
          <Item
            title="Dashboard"
            to="/admin/"
            icon={<DashboardOutlinedIcon />}
            selected={selected}
            setSelected={setSelected}
          />
          <Typography variant='h6' color={colors.grey[300]} sx={{ m: '15px 0 5px 20px' }}> Data </Typography>
          <SubMenu label="Products" icon={<LocalMallOutlinedIcon />}>
            <MenuItem icon={<ViewModuleOutlinedIcon />} component={<NavLink to='/admin/products' />}> All </MenuItem>
            <MenuItem icon={<AddOutlinedIcon />} component={<NavLink to='/admin/product' />}> Add </MenuItem>
          </SubMenu>
          <Item
            title="Orders"
            to='/admin/orders'
            icon={<ListAltOutlinedIcon />}
            selected={selected}
            setSelected={setSelected}
          />
          <Item
            title="Users"
            to="/admin/users"
            icon={<PeopleAltOutlinedIcon />}
            selected={selected}
            setSelected={setSelected}
          />
          <Item
            title="Reviews"
            to="/admin/reviews"
            icon={<RateReviewOutlinedIcon />}
            selected={selected}
            setSelected={setSelected}
          />
          <Item
            title="Support"
            to="/admin/support"
            icon={<SupportAgentIcon />}
            selected={selected}
            setSelected={setSelected}
          />
          <Typography variant='h6' color={colors.grey[300]} sx={{ m: '15px 0 5px 20px' }}> Charts </Typography>
          <Item
            title="Bar Chart"
            to="/admin/bar"
            icon={<BarChartOutlinedIcon />}
            selected={selected}
            setSelected={setSelected}
          />
          <Item
            title="Pie Chart"
            to="/admin/pie"
            icon={<PieChartOutlinedIcon />}
            selected={selected}
            setSelected={setSelected}
          />
          <Item
            title="Line Chart"
            to="/admin/line"
            icon={<TimelineOutlinedIcon />}
            selected={selected}
            setSelected={setSelected}
          />
        </Box>
      </Menu>
    </ProSidebar>
  )
}

export default Sidebar