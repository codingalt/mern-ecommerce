import React, { useEffect, useState } from 'react'
// import { Fragment, useState } from 'react'
import { Dialog, RadioGroup, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { StarIcon } from '@heroicons/react/20/solid'
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Rating from '@mui/material/Rating';
import { IconButton } from '@mui/material';
import { clearErrors, fetchProductDetails } from '../../features/product/productDetailsSlice'
import { useAlert } from 'react-alert';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../Loader';
import { addItemsToCart } from '../../features/cart/cartSlice';
import ProductCard from './ProductCard';
import MetaData from '../MetaData';


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const ProductDetails = () => {
    const alert = useAlert();
    const { id } = useParams();
    const dispatch = useDispatch();
    const { loading, product, relatedProducts, error } = useSelector(state => state.productDetails)
    const { user } = useSelector((state) => state.user)
    const [quantity, setQuantity] = useState(1)
    const [mainImage, setMainImage] = useState({})
    const [selectedColor, setSelectedColor] = useState({})
    const [selectedSize, setSelectedSize] = useState({})
    const increaseQuantity = (e) => {
        e.preventDefault()
        if (product.stock <= quantity) return
        const qty = quantity + 1
        setQuantity(qty)
    }
    const decreaseQuantity = (e) => {
        e.preventDefault()
        if (quantity <= 1) return
        const qty = quantity - 1
        setQuantity(qty)
    }
    const handleSubmit = (e) => {
        const cartData = {
            id,
            quantity,
            color: selectedColor && selectedColor.url,
            size: selectedColor && selectedSize.size
        }
        e.preventDefault()
        dispatch(addItemsToCart(cartData))
        alert.success("Item Added To Cart")
    }
    useEffect(() => {
        if (product) {
            setMainImage(product.images ? product.images[0] : {})
            setSelectedColor(product.colors ? product.colors[0] : {})
            setSelectedSize(product.sizes ? product.sizes[0] : {})
        }
    }, [product])

    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch(clearErrors())
        }
        dispatch(fetchProductDetails(id))
    }, [dispatch, id, alert, error])

    return (
        <>
            {loading ? <Loader /> :
                <>
                    <MetaData title='product details' />
                    <div className="relative flex w-full items-center overflow-hidden bg-white px-4 pb-8 sm:px-6 lg:px-28 pt-28">
                        <div className="grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-12 sm:gap-x-8 md:gap-x-14 lg:gap-x-20">
                            <div className='sm:col-span-4 lg:col-span-5'>
                                <div className="aspect-h-2 aspect-w-2 overflow-hidden rounded-lg bg-gray-100">
                                    <img src={mainImage.url} alt='product image' className="object-contain object-center" />
                                </div>
                                <div className='mt-2 grid grid-cols-3 lg:grid-cols-4 gap-2'>
                                    {product.images && product.images.map((img) => {
                                        return (
                                            <div key={img.id} onClick={() => setMainImage(img)} className="aspect-w-1 w-full overflow-hidden rounded-md h-24 cursor-pointer bg-gray-100">
                                                <img
                                                    src={img.url}
                                                    alt='product image'
                                                    className="h-full w-full object-contain object-center lg:h-full lg:w-full"
                                                />
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className="sm:col-span-8 lg:col-span-7">
                                <h2 className="text-2xl font-bold text-gray-500 sm:pr-12">{product.name}</h2>

                                <section aria-labelledby="information-heading" className="mt-2">
                                    <h3 id="information-heading" className="sr-only">
                                        Product information
                                    </h3>

                                    <p className="text-lg sm:text-2xl font-medium sm:font-semibold text-orange-600">Rs. {product.price}</p>

                                    {/* Reviews */}
                                    <div className="mt-6">
                                        <h4 className="sr-only">Reviews</h4>
                                        <div className="flex items-center">
                                            <Rating
                                                size='medium'
                                                value={product.ratings}
                                                readOnly
                                                precision='0.5'
                                            />
                                            <p className="sr-only">{product.ratings} out of 5 stars</p>
                                            <a href="#" className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                                                {product.numOfReviews} reviews
                                            </a>
                                        </div>
                                    </div>
                                </section>

                                <section aria-labelledby="options-heading" className="mt-10">
                                    <h3 id="options-heading" className="sr-only">
                                        Product options
                                    </h3>

                                    <form onSubmit={handleSubmit} encType='multipart/form-data'>
                                        {/* Colors */}
                                        {product && product.colors.length > 0 &&
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-600">Color:</h4>

                                                <RadioGroup value={selectedColor} onChange={setSelectedColor} className="mt-4">
                                                    <RadioGroup.Label className="sr-only">Choose a color</RadioGroup.Label>
                                                    <span className="flex items-center space-x-3">
                                                        {product.colors.map((color) => (
                                                            <RadioGroup.Option
                                                                key={color._id}
                                                                value={color}
                                                                className={({ active, checked }) =>
                                                                    classNames(
                                                                        active && checked ? 'ring ring-offset-1' : '',
                                                                        !active && checked ? 'ring-2' : '',
                                                                        'focus:outline-none rounded-sm'
                                                                    )
                                                                }
                                                            >
                                                                <RadioGroup.Label as="div" className="sr-only">
                                                                    <img src={color.url} alt='color images' />
                                                                </RadioGroup.Label>
                                                                <div className="aspect-w-1 min-w-[64px] overflow-hidden rounded-sm h-16 cursor-pointer bg-gray-100">
                                                                    <img
                                                                        src={color.url}
                                                                        alt='product colors preview'
                                                                        className="h-full w-full object-contain object-center"
                                                                    />
                                                                </div>
                                                            </RadioGroup.Option>
                                                        ))}
                                                    </span>
                                                </RadioGroup>
                                            </div>
                                        }

                                        {/* Sizes */}
                                        {product && product.sizes.length > 0 &&
                                            <div className="mt-10">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="text-sm font-semibold text-gray-600">Size:</h4>
                                                    {/* <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                                                        Size guide
                                                    </a> */}
                                                </div>

                                                <RadioGroup value={selectedSize} onChange={setSelectedSize} className="mt-4">
                                                    <RadioGroup.Label className="sr-only">Choose a size</RadioGroup.Label>
                                                    <div className="grid grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
                                                        {product.sizes.map((size) => (
                                                            <RadioGroup.Option
                                                                key={size.size}
                                                                value={size}
                                                                // disabled={!size.inStock}
                                                                className={({ active }) =>
                                                                    classNames(
                                                                        // size.inStock
                                                                        //     ? 'cursor-pointer bg-white text-gray-900 shadow-sm'
                                                                        //     : 'cursor-not-allowed bg-gray-50 text-gray-200',
                                                                        active ? 'ring-2 ring-indigo-500' : '',
                                                                        'group relative flex items-center justify-center rounded-md border py-3 px-4 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1'
                                                                    )
                                                                }
                                                            >
                                                                {({ active, checked }) => (
                                                                    <>
                                                                        <RadioGroup.Label as="span">{size.size}</RadioGroup.Label>
                                                                        <span
                                                                            className={classNames(
                                                                                active ? 'border' : 'border-2',
                                                                                checked ? 'border-indigo-500' : 'border-transparent',
                                                                                ' absolute -inset-px rounded-md cursor-pointer'
                                                                            )}
                                                                            aria-hidden="true"
                                                                        />
                                                                    </>
                                                                )}
                                                            </RadioGroup.Option>
                                                        ))}
                                                    </div>
                                                </RadioGroup>
                                            </div>
                                        }
                                        <div className='my-5 flex items-center gap-7'>
                                            <div className='border border-gray-200 rounded-sm'>
                                                <button onClick={decreaseQuantity} className='bg-gray-100 p-2 hover:bg-gray-200 transition-all'>
                                                    <RemoveIcon />
                                                </button>
                                                <input type="number" readOnly value={quantity} className='border-none w-14 text-center p-1' />
                                                <button onClick={increaseQuantity} className='bg-gray-100 p-2 hover:bg-gray-200 transition-all'>
                                                    <AddIcon />
                                                </button>
                                                {/* <button onClick={increaseQuantity} className='border-none bg-gray-100 font-semibold text-lg px-3 py-1'>+</button> */}
                                            </div>
                                            <button type='submit' disabled={product.stock < 1 ? true : false} className='font-medium rounded-full bg-violet-500 py-3 px-7 text-white hover:bg-violet-600 shadow-sm'>Add to Cart</button>
                                            {/* <button disabled={stock < 1 ? true : false} onClick={addToCartHandler}>Add to Cart</button> */}
                                        </div>
                                        <p>
                                            Status:
                                            <span className={product.stock < 1 ? "text-red-500" : "text-green-500"}>
                                                {product.stock < 1 ? " Out of Stock" : " In Stock"}
                                            </span>
                                        </p>
                                        <p className='my-4'> <span className='font-bold'>Description: </span> {product.description} </p>
                                    </form>
                                </section>
                            </div>
                        </div>
                    </div>
                    <section className='py-6 px-4 sm:px-6 lg:px-28'>
                        <div className='w-full md:w-[80%] lg:w-[60%]'>
                            <h1 className='text-lg font-bold text-gray-500 px-1 border-b-2 border-gray-300 w-fit'>Reviews</h1>
                            {product.reviews.length > 0 ? (
                                product.reviews.map((review, ind) => {
                                    const { _id, name, rating, comment, reviewedAt } = review;
                                    const options = {
                                        value: rating,
                                        readOnly: true,
                                        precision: 0.5
                                    };
                                    return (
                                        <div key={_id} className="relative mt-9 flex items-center gap-x-4 border-b last:border-b-0 border-gray-200 pb-4">
                                            <img
                                                src={user?.avatar?.url ? user.avatar.url : "./images/profile.png"}
                                                alt="avatar"
                                                className="h-12 w-12 flex-none rounded-full bg-gray-50 self-start"
                                            />
                                            <div className="text-sm leading-6">
                                                <p className="font-semibold text-gray-900">
                                                    {name}
                                                </p>
                                                <p>{reviewedAt.slice(0, 10)}</p>
                                                <Rating {...options} size='small' className='my-3' />
                                                <p>{comment}</p>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className='text-gray-500 text-sm md:text-base mt-2'>Product has no reviews yet</p>
                            )}
                        </div>
                    </section>
                    {relatedProducts.length > 0 && (
                        <section className="bg-gray-50">
                            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                                <h2 className="text-2xl font-bold tracking-tight text-gray-900">You May Also Like</h2>

                                <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                                    {relatedProducts.map((product) => {
                                        return <ProductCard key={product._id} product={product} />
                                    })}
                                </div>
                            </div>
                        </section>
                    )}
                </>
            }
        </>
    )
}

export default ProductDetails