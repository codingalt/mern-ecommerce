import React from 'react'
import { NavLink } from 'react-router-dom'

const NotFound = () => {
    return (
        <div className='h-screen fixed top-0 left-0 z-30 bg-white'>
            <img src="./images/error.jpg" alt="error" className='w-[50%] my-0 mx-auto' />
            <div className='text-center'>
                <NavLink to='/' className='bg-gray-400 text-white py-3 px-7 shadow-md font-semibold text-lg hover:bg-gray-500'>Home</NavLink>
            </div>
        </div>
    )
}

export default NotFound