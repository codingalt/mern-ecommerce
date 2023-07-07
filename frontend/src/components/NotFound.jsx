import React from 'react'
import { NavLink } from 'react-router-dom'
import error from '/images/error.jpg'

const NotFound = () => {
    return (
        <div className='h-screen w-full fixed top-0 left-0 z-30 bg-white'>
            <div className='h-full flex flex-col justify-center items-center gap-7'>
                <p className='text-lg sm:text-xl font-semibold sm:font-bold text-[#1C056D]'>Page not found</p>
                <img src={error} alt="error" className='w-[450px] mx-auto' />
                <div className='text-center'>
                    <NavLink to='/' className='bg-gray-400 text-white py-2 sm:py-3 px-7 sm:px-8 shadow-md font-semibold text-sm sm:text-lg hover:bg-gray-500'>Home</NavLink>
                </div>
            </div>
        </div>
    )
}

export default NotFound