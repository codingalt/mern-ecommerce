import React from 'react'
import { Fragment, useState } from 'react'
import { Dialog, Popover, Tab, Transition } from '@headlessui/react'
import { Bars3Icon, MagnifyingGlassIcon, ShoppingBagIcon, XMarkIcon } from '@heroicons/react/24/outline'
import {
    Carousel,
    initTE,
} from "tw-elements";
import { NavLink } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import { Box, IconButton, InputBase, useTheme } from '@mui/material'

initTE({ Carousel });

const navigation = [
    { name: 'Products', href: '/products' },
    { name: 'Women', href: '#' },
    { name: 'Men', href: '#' },
    // { name: 'Company', href: '#' },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const HeroSection = () => {
    return (
        <>
            <div className="h-[50vh] md:h-[80vh] lg:h-[90vh] bg-no-repeat bg-cover bg-[url('/images/bg-img7.svg')]">
                <div className='h-full mx-auto w-[90%] md:grid md:grid-cols-custom flex justify-center pt-16'>
                    <div className='text-center flex flex-col justify-center px-4'>
                        <h1 className='text-2xl uppercase md:text-4xl lg:text-5xl font-extrabold flex flex-col'>
                            <span className='italic bg-clip-text text-transparent bg-gradient-to-tr from-pink-500 to-violet-500 border-2 border-transparent'>unlock your </span>
                            <span className='italic text-5xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-tr from-pink-500 to-violet-500'>style</span> 
                        </h1>
                        <NavLink to="/products"
                            className="rounded-full bg-gradient-to-tr from-pink-500 to-violet-500 self-center px-6 py-2 md:px-7 md:py-3 mt-7 text-base md:text-xl uppercase font-medium sm:font-bold md:font-extrabold text-white shadow-sm hover:from-pink-500 hover:to-yellow-500"

                        >
                            Shop now
                        </NavLink>
                    </div>
                    <div className="hidden md:inline-block aspect-w-1 w-full overflow-hidden h-full">
                        <img className="h-full w-full object-cover object-center lg:object-contain lg:h-full lg:w-full" src="/images/banner3.png" alt="Modern building architecture" />
                    </div>
                </div>
            </div>
        </>
    )
}

export default HeroSection