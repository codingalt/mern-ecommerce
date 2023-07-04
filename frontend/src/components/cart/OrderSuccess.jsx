import React from 'react'
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckIcon from '@mui/icons-material/Check';
import { NavLink } from 'react-router-dom';

const OrderSuccess = () => {
  return (
    <div className="h-[100vh] flex flex-col justify-center items-center">
      <span className='bg-gradient-to-tr from-pink-500 to-violet-500 w-14 h-14 rounded-full flex justify-center items-center shadow-sm shadow-violet-500 mb-4'>
        <CheckIcon style={{background: 'transparent', fontSize: '45px', color: 'white'}}/>
      </span>
      {/* <CheckCircleIcon style={{color: 'tomato', fontSize: '50px', marginBottom: '5px'}}/> */}
      <p>Your order has been placed successfully</p>
      <NavLink to="/orders" className='bg-gray-500 hover:bg-gray-600 text-white mt-3 py-2.5 px-5'>View Orders</NavLink>
    </div>
  )
}


export default OrderSuccess