import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import Rating from '@mui/material/Rating';

const ProductCard = ({ product }) => {
    const { _id, name, description, price, ratings, images, category, stock, numOfReviews, } = product
    const [width, setWidth] = useState(window.innerWidth);
    function getSize() {
        setWidth(window.innerWidth)
    }
    const options = {
        size: width < 600 ? 'small' : 'medium',
        value: ratings,
        readOnly: true,
        precision: 0.5
    }
    useEffect(() => {
        window.addEventListener('resize', getSize)
        return () => {
            window.removeEventListener('resize', getSize)
        }
    }, [window.innerWidth])
    return (
        <NavLink to={`/product/${_id}`} className='shadow-md pb-3 rounded-lg bg-white'>
            <div key={product.id} className="group relative">
                <div className="min-h-80 aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-t-lg lg:aspect-none group-hover:opacity-75 lg:h-72">
                    <img
                        src={images[0].url}
                        alt={name}
                        className="h-full w-full object-contain object-center lg:h-full lg:w-full"
                    />
                </div>
                <div className='mt-4 px-2 sm:px-3 flex flex-col gap-1'>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-700">
                        {name}
                    </h3>
                    <div className='flex items-center gap-1 sm:gap-2'>
                        <Rating {...options}></Rating>
                        <span className='text-xs xs:text-sm text-gray-600'>({numOfReviews}) reviews</span>
                    </div>
                    <p className="text-sm sm:text-base font-semibold text-orange-500">{`Rs. ${price}`}</p>
                </div>
            </div>
        </NavLink>
    )
}

export default ProductCard