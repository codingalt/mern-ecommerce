import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { clearErrors, fetchProducts } from '../../features/product/productSlice'
import Loader from '../Loader'
import { useAlert } from 'react-alert'
import ProductCard from './ProductCard'
import { NavLink } from 'react-router-dom'

const ProductsList = () => {
  const alert = useAlert()
  const { loading, products, error, productCount } = useSelector(state => state.product)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchProducts({ keyword: '' }))
  }, [dispatch, productCount])
  useEffect(() => {
    if (error) {
      alert.error(error)
      dispatch(clearErrors())
    }
    // dispatch(fetchProducts({ keyword: '' }))
  }, [dispatch, error, productCount])
  return (
    <>
      {loading ?
        <Loader />
        :
        <div className="bg-gray-50 py-5">
          <div className="w-[96%] md:w-[94%] lg:w-[90%] mx-auto">
            <h2 className="text-xl font-semibold sm:text-2xl md:text-3xl sm:font-bold tracking-tight text-gray-600">New Arrivals</h2>

            <div className="mt-6 grid gap-4 sm:gap-x-6 gap-y-6 sm:gap-y-10 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:gap-x-8">
              {products.length > 0 ? (
                products.map((product) => {
                  return <ProductCard key={product._id} product={product} />
                })
              ) :
                <p className='text-center'>No Product Found</p>
              }
            </div>
            <NavLink to='/products'
              className='block text-right text-orange-500 text-sm font-semibold mt-10 hover:underline cursor-pointer'
            >
              See all products
            </NavLink>
          </div>
        </div>
      }
    </>
  )
}

export default ProductsList