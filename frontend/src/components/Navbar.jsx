import React, { useState, Fragment, useEffect } from 'react'
import { Dialog, Popover, Tab, Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, MagnifyingGlassIcon, ShoppingBagIcon, XMarkIcon } from '@heroicons/react/24/outline'
import {
    Carousel,
    initTE,
} from "tw-elements";
import { NavLink, useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import { Box, IconButton, InputAdornment, InputBase, OutlinedInput, useTheme } from '@mui/material'
import UserOptions from './UserOptions';
import { useSelector } from 'react-redux';

initTE({ Carousel });

const navigation = [
    { name: 'Products', href: '/products' },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const Navbar = () => {
    const navigate = useNavigate()
    const [open, setOpen] = useState(false)
    const [keyword, setKeyword] = useState('')
    const { isAuthenticated, user } = useSelector((state) => state.user)
    const { cartItems } = useSelector((state) => state.cart)
    const handleSubmit = (e) => {
        e.preventDefault()
        if (keyword.trim()) {
            navigate(`/products/${keyword}`)
        } else {
            navigate('/products')
        }
        setKeyword('')
    }
    return (
        <>
            <div className="bg-whit">
                {/* Mobile menu */}
                <Dialog as="div" className="lg:hidden" open={open} onClose={setOpen}>
                    <div className="fixed inset-0 z-50" />
                    <Dialog.Panel className="fixed inset-y-0 left-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                        <div className="flex items-center justify-between">
                            <NavLink to='/' className="-m-1.5 p-1.5" onClick={() => setOpen(false)}>
                                <span className="sr-only">Your Company</span>
                                <img
                                    className="h-8 w-auto"
                                    src="/images/logo.png"
                                    alt=""
                                />
                            </NavLink>
                            <button
                                type="button"
                                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                                onClick={() => setOpen(false)}
                            >
                                <span className="sr-only">Close menu</span>
                                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                            </button>
                        </div>
                        <div className="mt-6 flow-root">
                            <div className="-my-6 divide-y divide-gray-500/10">
                                <div className="space-y-2 py-6">
                                    {navigation.map((item) => (
                                        <NavLink
                                            to={item.href}
                                            key={item.name}
                                            onClick={() => setOpen(false)}
                                            className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                        >
                                            {item.name}
                                        </NavLink>
                                    ))}
                                </div>
                                <div className="py-6">
                                    <NavLink to='/login' onClick={() => setOpen(false)} className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                                        Log in
                                    </NavLink>
                                </div>
                            </div>
                        </div>
                    </Dialog.Panel>
                </Dialog>

                <header className="absolute w-full z-20 bg-transparent">
                    <nav aria-label="Top" className="mx-auto w-[96%] md:w-[94%] lg:w-[90%] pr-1.5 md:px-2">
                        <div className="flex h-16 items-center">
                            <button
                                type="button"
                                className="rounded-md bg-white p-2 text-gray-400 lg:hidden"
                                onClick={() => setOpen(true)}
                            >
                                <span className="sr-only">Open menu</span>
                                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                            </button>

                            {/* Logo */}
                            <div className="ml-2 md:ml-4 flex-none lg:ml-0">
                                <NavLink to='/' className='flex items-center gap-1'>
                                    <span className="sr-only">Your Company</span>
                                    <img
                                        className="h-8 w-auto"
                                        src="/images/logo.png"
                                        alt=""
                                    />
                                    <h2
                                        className='hidden md:inline-block font-extrabold text-transparent text-2xl bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500 uppercase'
                                    >
                                        Ecommerece
                                    </h2>
                                </NavLink>
                            </div>

                            {/* Flyout menus */}
                            <div className="hidden lg:flex lg:ml-8 lg:gap-x-12">
                                {navigation.map((item) => (
                                    <NavLink key={item.name} to={item.href} className="text-base font-semibold leading-6 text-gray-500">
                                        {item.name}
                                    </NavLink>
                                ))}
                            </div>

                            <div className="flex-1 flex items-center">
                                <form onSubmit={handleSubmit} className='flex flex-1 max-w-lg mx-2 md:mx-[60px] rounded-md h-10'>
                                    <InputBase
                                        fullWidth
                                        className='bg-white bg-opacity-70 h-9 sm:h-10 pl-4 shadow-[0_0px_15px_-4px_rgba(0,0,0,0.3)] rounded-md text-sm'
                                        type='text'
                                        placeholder='Search...'
                                        value={keyword}
                                        onChange={(e) => setKeyword(e.target.value)}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <button type='submit' className='bg-gradient-to-tr from-pink-500 to-violet-500 text-white h-9 w-9 sm:h-10 sm:w-10 md:w-12 flex justify-center items-center rounded-r-md'>
                                                    <SearchIcon />
                                                </button>
                                            </InputAdornment>
                                        }
                                    />
                                </form>

                                {!isAuthenticated &&
                                    <div className="hidden lg:flex lg:items-center lg:justify-end lg:space-x-6">
                                        <NavLink to="/login" className="text-sm font-medium text-gray-700 hover:text-gray-800">
                                            Sign in
                                        </NavLink>
                                        <span className="h-6 w-px bg-gray-200" aria-hidden="true" />
                                        <NavLink to="/register" className="text-sm font-medium text-gray-700 hover:text-gray-800">
                                            Create account
                                        </NavLink>
                                    </div>
                                }

                                {/* Cart */}
                                <div className="md:ml-4 flow-root lg:ml-auto">
                                    <NavLink to="/cart" className="group -m-2 flex items-center p-2">
                                        <ShoppingBagIcon
                                            className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                                            aria-hidden="true"
                                        />
                                        <span className="ml-1 text-sm font-medium text-gray-700 group-hover:text-gray-800">{cartItems.length}</span>
                                        <span className="sr-only">items in cart, view bag</span>
                                    </NavLink>
                                </div>
                                {isAuthenticated &&
                                    <div className='ml-2 md:ml-10'>
                                        <UserOptions user={user} />
                                    </div>
                                }
                            </div>
                        </div>
                    </nav>
                </header>
            </div>
        </>
    )
}

export default Navbar