import React from 'react'
import { Fragment, useState } from 'react'
import { Dialog, Disclosure, Menu, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon, FunnelIcon, MinusIcon, PlusIcon, Squares2X2Icon } from '@heroicons/react/20/solid'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { clearErrors, fetchProducts } from '../../features/product/productSlice'
import Loader from '../Loader'
import { useAlert } from 'react-alert'
import ProductCard from './ProductCard'
import { useParams } from 'react-router-dom'
import Pagination from 'react-js-pagination'
import MetaData from '../MetaData'
import { getAllCategories } from '../../features/product/categoriesSlice'
import { Rating, Slider } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';

const sortOptions = [
    { name: 'Newest', href: '#', value: 'newest', current: true },
    // { name: 'Most Popular', href: '#', value: 'most popular', current: false },
    { name: 'Best Rating', href: '#', value: 'best rating', current: false },
    { name: 'Price: Low to High', href: '#', value: 'lowest', current: false },
    { name: 'Price: High to Low', href: '#', value: 'highest', current: false },
]

const ratingOptions = [
    {
        size: "medium",
        value: 4,
        readOnly: true,
    },
    {
        size: "medium",
        value: 3,
        readOnly: true,
    },
    {
        size: "medium",
        value: 2,
        readOnly: true,
    },
    {
        size: "medium",
        value: 1,
        readOnly: true,
    }
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const Products = () => {
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
    let { keyword } = useParams();
    const alert = useAlert()
    const { loading, products, error, productCount, resultPerPage, filteredProductsCount } = useSelector(state => state.product)
    const { loading: categoriesLoading, categories, error: categoreisError } = useSelector((state) => state.categories)
    const [currentPage, setCurrentPage] = useState(1)
    const [price, setPrice] = useState([0, 25000])
    const [category, setCategory] = useState("")
    const [ratings, setRatings] = useState(0)
    const [order, setOrder] = useState('')
    const clearAllFilters = () => {
        setPrice([0, 25000])
        setCategory('')
        setRatings(0)
    }
    const handleRatingsChange = (option) => {
        setRatings(option);
        setMobileFiltersOpen(false)
    }
    const handleCategoryChange = (category) => {
        setCategory(category)
        setMobileFiltersOpen(false)
    }
    const setCurrentPageNo = (e) => {
        setCurrentPage(e)
    }
    if (!keyword) {
        keyword = ''
    }
    const priceHandler = (event, newValue) => {
        setPrice(newValue);
    }
    const data = {
        keyword,
        currentPage,
        price,
        category,
        ratings,
        order
    }
    const applyPriceFilter = () => {
        dispatch(fetchProducts(data))
    }
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(getAllCategories());
    }, [])
    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch(clearErrors())
        }
        dispatch(fetchProducts(data))
    }, [dispatch, error, productCount, keyword, currentPage, price, category, ratings, order])
    return (
        <>
            <MetaData title="products" />
            <div className="bg-gray-50 pt-10 min-h-screen">
                <div>
                    {/* Mobile filter dialog */}
                    <Transition.Root show={mobileFiltersOpen} as={Fragment}>
                        <Dialog as="div" className="relative z-40 lg:hidden" onClose={setMobileFiltersOpen}>
                            <Transition.Child
                                as={Fragment}
                                enter="transition-opacity ease-linear duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="transition-opacity ease-linear duration-300"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <div className="fixed inset-0 bg-black bg-opacity-25" />
                            </Transition.Child>

                            <div className="fixed inset-0 z-40 flex">
                                <Transition.Child
                                    as={Fragment}
                                    enter="transition ease-in-out duration-300 transform"
                                    enterFrom="translate-x-full"
                                    enterTo="translate-x-0"
                                    leave="transition ease-in-out duration-300 transform"
                                    leaveFrom="translate-x-0"
                                    leaveTo="translate-x-full"
                                >
                                    <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
                                        <div className="flex items-center justify-between px-4">
                                            <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                                            <button
                                                type="button"
                                                className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                                                onClick={() => setMobileFiltersOpen(false)}
                                            >
                                                <span className="sr-only">Close menu</span>
                                                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                            </button>
                                        </div>

                                        <form className="mt-4 border-t border-gray-200">
                                            <div className='border-t border-gray-200 px-4 py-5'>
                                                <p className="text-gray-900 font-semibold">Price</p>
                                                <p className="font-normal">Select Price Range</p>
                                                <div className='w-full px-2 '>
                                                    <Slider
                                                        value={price}
                                                        onChange={(e, newValue) => setPrice(newValue)}
                                                        onChangeCommitted={() => setMobileFiltersOpen(false)}
                                                        valueLabelDisplay="auto"
                                                        min={0}
                                                        max={25000}
                                                    />
                                                </div>
                                            </div>
                                            <Disclosure as="div" className="border-t border-gray-200 px-4 py-6">
                                                {({ open }) => (
                                                    <>
                                                        <h3 className="-mx-2 -my-3 flow-root">
                                                            <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                                                                <span className="font-medium text-gray-900">Category</span>
                                                                <span className="ml-6 flex items-center">
                                                                    {open ? (
                                                                        <MinusIcon className="h-5 w-5" aria-hidden="true" />
                                                                    ) : (
                                                                        <PlusIcon className="h-5 w-5" aria-hidden="true" />
                                                                    )}
                                                                </span>
                                                            </Disclosure.Button>
                                                        </h3>
                                                        <Disclosure.Panel className="pt-6 pl-2">
                                                            <div className="space-y-6">
                                                                {categories.map((category, optionIdx) => (
                                                                    <div key={category} className="flex items-center">
                                                                        <p onClick={() => handleCategoryChange(category)} className="cursor-pointer min-w-0 flex-1 text-gray-500">
                                                                            {category}
                                                                        </p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </Disclosure.Panel>
                                                    </>
                                                )}
                                            </Disclosure>
                                            <Disclosure as="div" className="border-t border-gray-200 px-4 py-6">
                                                {({ open }) => (
                                                    <>
                                                        <h3 className="-mx-2 -my-3 flow-root">
                                                            <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                                                                <span className="font-medium text-gray-900">Ratings</span>
                                                                <span className="ml-6 flex items-center">
                                                                    {open ? (
                                                                        <MinusIcon className="h-5 w-5" aria-hidden="true" />
                                                                    ) : (
                                                                        <PlusIcon className="h-5 w-5" aria-hidden="true" />
                                                                    )}
                                                                </span>
                                                            </Disclosure.Button>
                                                        </h3>
                                                        <Disclosure.Panel className="pt-6 pl-2">
                                                            <div className="space-y-6">
                                                                {ratingOptions.map((rating, ind) => (
                                                                    <div key={rating.value} className="flex items-center">
                                                                        <input
                                                                            type="radio"
                                                                            id={`rating-option-${ind}`}
                                                                            name="rating-options"
                                                                            value={rating.value}
                                                                            onChange={() => handleRatingsChange(rating.value)}
                                                                        />
                                                                        <label
                                                                            htmlFor={`rating-option-${ind}`}
                                                                            className="ml-3 min-w-0 flex-1 text-gray-500 flex items-center gap-1"
                                                                        >
                                                                            <Rating {...rating} /> <span>& Up</span>
                                                                        </label>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </Disclosure.Panel>
                                                    </>
                                                )}
                                            </Disclosure>
                                        </form>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </Dialog>
                    </Transition.Root>

                    <main className="w-[96%] md:w-[94%] lg:w-[90%] mx-auto">
                        <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24">
                            <h1 className="text-lg md:text-3xl lg:text-4xl font-semibold md:font-bold tracking-tight text-gray-900">New Arrivals</h1>

                            <div className="flex items-center">
                                <Menu as="div" className="relative inline-block text-left">
                                    <div>
                                        <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                                            Sort
                                            <ChevronDownIcon
                                                className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                                                aria-hidden="true"
                                            />
                                        </Menu.Button>
                                    </div>

                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                    >
                                        <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                                            <div className="py-1">
                                                {sortOptions.map((option) => (
                                                    <Menu.Item key={option.name}>
                                                        {({ active }) => (
                                                            <p
                                                                onClick={() => setOrder(option.value)}
                                                                className={classNames(
                                                                    option.current ? 'font-medium text-gray-900' : 'text-gray-500',
                                                                    active ? 'bg-gray-100' : '',
                                                                    'block px-4 py-2 text-sm cursor-pointer'
                                                                )}
                                                            >
                                                                {option.name}
                                                            </p>
                                                        )}
                                                    </Menu.Item>
                                                ))}
                                            </div>
                                        </Menu.Items>
                                    </Transition>
                                </Menu>

                                <button type="button" className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 sm:ml-7">
                                    <span className="sr-only">View grid</span>
                                    <Squares2X2Icon className="h-5 w-5" aria-hidden="true" />
                                </button>
                                <button
                                    type="button"
                                    className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                                    onClick={() => setMobileFiltersOpen(true)}
                                >
                                    <span className="sr-only">Filters</span>
                                    <FunnelIcon className="h-5 w-5" aria-hidden="true" />
                                </button>
                            </div>
                        </div>

                        <section aria-labelledby="products-heading" className="pb-24 pt-6">
                            <h2 id="products-heading" className="sr-only">
                                Products
                            </h2>

                            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
                                {/* Filters */}
                                <form className="hidden lg:block">
                                    <div className='border-b border-gray-200 pb-5'>
                                        <p className="font-semibold text-gray-900">Price</p>
                                        <p className="font-normal pl-1 mb-1">Select Price Range</p>
                                        <div className='px-3 flex items-center'>
                                            <Slider
                                                value={price}
                                                onChange={priceHandler}
                                                valueLabelDisplay="auto"
                                                min={0}
                                                max={25000}
                                            />
                                        </div>
                                    </div>

                                    <Disclosure as="div" className="border-b border-gray-200 py-6">
                                        {({ open }) => (
                                            <>
                                                <h3 className="-mx-2 -my-3 flow-root">
                                                    <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                                                        <span className="font-medium text-gray-900">Category</span>
                                                        <span className="ml-6 flex items-center">
                                                            {open ? (
                                                                <MinusIcon className="h-5 w-5" aria-hidden="true" />
                                                            ) : (
                                                                <PlusIcon className="h-5 w-5" aria-hidden="true" />
                                                            )}
                                                        </span>
                                                    </Disclosure.Button>
                                                </h3>
                                                <Disclosure.Panel className="pt-6 pl-2">
                                                    <div className="space-y-6">
                                                        {categories.map((option, optionIdx) => (
                                                            <div key={option} className="flex items-center">
                                                                <p onClick={() => { setCategory(option); handleAdd(category) }} className="cursor-pointer min-w-0 flex-1 text-gray-500">
                                                                    {option}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </Disclosure.Panel>
                                            </>
                                        )}
                                    </Disclosure>
                                    <Disclosure as="div" className="border-b border-gray-200 py-6">
                                        {({ open }) => (
                                            <>
                                                <h3 className="-mx-2 -my-3 flow-root">
                                                    <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                                                        <span className="font-medium text-gray-900">Ratings</span>
                                                        <span className="ml-6 flex items-center">
                                                            {open ? (
                                                                <MinusIcon className="h-5 w-5" aria-hidden="true" />
                                                            ) : (
                                                                <PlusIcon className="h-5 w-5" aria-hidden="true" />
                                                            )}
                                                        </span>
                                                    </Disclosure.Button>
                                                </h3>
                                                <Disclosure.Panel className="pt-6 pl-2">
                                                    <div className="space-y-6">
                                                        {ratingOptions.map((rating, ind) => (
                                                            <div key={rating.value} className="flex items-center">
                                                                <input
                                                                    type="radio"
                                                                    id={`rating-option-${ind}`}
                                                                    name="rating-options"
                                                                    value={rating.value}
                                                                    onChange={() => handleRatingsChange(rating.value)}
                                                                />
                                                                <label
                                                                    htmlFor={`rating-option-${ind}`}
                                                                    className="ml-3 min-w-0 flex-1 text-gray-500 flex items-center gap-1"
                                                                >
                                                                    <Rating {...rating} /> <span>& Up</span>
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </Disclosure.Panel>
                                            </>
                                        )}
                                    </Disclosure>
                                </form>

                                {/* Product grid */}
                                <div className="lg:col-span-3">
                                    <div className='flex gap-2 flex-wrap'>
                                        {price[0] === 0 && price[1] === 25000 ? '' :
                                            <div className='bg-gray-200 flex gap-1 items-center py-2 px-2 rounded-3xl'>
                                                <span className='text-sm'>{price[0]} - {price[1]}</span>
                                                <button onClick={() => setPrice([0, 25000])} className='flex items-center justify-center bg-gray-300 rounded-full p-0.5'>
                                                    <CloseIcon style={{ fontSize: '16px' }} />
                                                </button>
                                            </div>
                                        }
                                        {category &&
                                            <div className='bg-gray-200 flex gap-1 items-center py-2 px-2 rounded-3xl'>
                                                <span className='text-sm'>{category}</span>
                                                <button onClick={() => setCategory('')} className='flex items-center justify-center bg-gray-300 rounded-full p-0.5'>
                                                    <CloseIcon style={{ fontSize: '16px' }} />
                                                </button>
                                            </div>
                                        }
                                        {ratings !== 0 &&
                                            <div className='bg-gray-200 flex gap-1 items-center py-2 px-2 rounded-3xl'>
                                                <span className='text-sm'>ratings {ratings} & above</span>
                                                <button onClick={() => setRatings(0)} className='flex items-center justify-center bg-gray-300 rounded-full p-0.5'>
                                                    <CloseIcon style={{ fontSize: '16px' }} />
                                                </button>
                                            </div>
                                        }
                                        {category !== '' || ratings !== 0 || price[0] !== 0 || price[1] !== 25000 ?
                                            <button onClick={clearAllFilters} className='bg-violet-500 hover:bg-violet-600 text-white text-sm py-1.5 px-2 rounded-lg'>
                                                Clear Filters
                                            </button>
                                            : ''
                                        }
                                    </div>
                                    <div className="mt-6 grid gap-x-4 sm:gap-x-6 gap-y-6 sm:gap-y-10 grid-cols-2 above-md:grid-cols-3 lg:grid-cols-3 xl:gap-x-8">
                                        {
                                            products.length > 0 ? (
                                                products.map((product) => {
                                                    return <ProductCard key={product._id} product={product} />
                                                })
                                            ) :
                                                <p className='text-center'>No Product Found</p>
                                        }
                                    </div>
                                </div>
                            </div>
                        </section>
                    </main>
                </div>
                {resultPerPage < filteredProductsCount &&
                    <div className="pagination-container pb-10">
                        <Pagination
                            activePage={currentPage}
                            itemsCountPerPage={resultPerPage}
                            totalItemsCount={productCount}
                            onChange={setCurrentPageNo}
                            nextPageText=">"
                            prevPageText="<"
                            firstPageText="<<"
                            lastPageText=">>"
                            itemClass='page-item'
                            linkClass='page-link'
                            activeClass='active'
                            activeLinkClass='page-link-active'

                        />
                    </div>
                }
            </div>
        </>
    )
}

export default Products