{loading ? <Loader /> :
                <>
                    <div className="relative flex w-full items-center overflow-hidden bg-white px-4 pb-8 sm:px-6 lg:px-28 pt-28">
                        <div className="grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-12 sm:gap-x-8 md:gap-x-14 lg:gap-x-20">
                            <div className='sm:col-span-4 lg:col-span-5'>
                                <div className="aspect-h-2 aspect-w-2 overflow-hidden rounded-lg bg-gray-100">
                                    <img src={mainImage.url} alt='product image' className="object-cover object-center" />
                                </div>
                                <div className='mt-2 grid grid-cols-3 lg:grid-cols-4 gap-2'>
                                    {product.images && product.images.map((img) => {
                                        return (
                                            <div key={img.id} onClick={() => setMainImage(img)} className="aspect-w-1 w-full overflow-hidden rounded-md h-24 cursor-pointer">
                                                <img
                                                    src={img.url}
                                                    alt='product image'
                                                    className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                                                />
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className="sm:col-span-8 lg:col-span-7">
                                <h2 className="text-2xl font-bold text-gray-900 sm:pr-12">{product.name}</h2>

                                <section aria-labelledby="information-heading" className="mt-2">
                                    <h3 id="information-heading" className="sr-only">
                                        Product information
                                    </h3>

                                    <p className="text-2xl text-gray-900">{product.price}</p>

                                    {/* Reviews */}
                                    <div className="mt-6">
                                        <h4 className="sr-only">Reviews</h4>
                                        <div className="flex items-center">
                                            <Rating {...options} />
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
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900">Color</h4>
                                        </div>

                                        {/* Sizes */}
                                        <div className="mt-10">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-sm font-medium text-gray-900">Size</h4>
                                                <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                                                    Size guide
                                                </a>
                                            </div>

                                            <RadioGroup value={selectedSize} onChange={setSelectedSize} className="mt-4">
                                                <RadioGroup.Label className="sr-only">Choose a size</RadioGroup.Label>
                                                <div className="grid grid-cols-4 gap-4 md:gap-6">
                                                    {product.sizes.map((size) => (
                                                        <RadioGroup.Option
                                                            key={size.size}
                                                            value={size}
                                                            className={({ active }) =>
                                                                classNames(
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
                                                                            'pointer-events-none absolute -inset-px rounded-md'
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
                                        <div className='my-5 flex items-center gap-7'>
                                            <div className='border border-gray-200 rounded-sm'>
                                                <button onClick={decreaseQuantity} className='bg-gray-100 p-2 hover:bg-gray-200 transition-all'>
                                                    <RemoveIcon />
                                                </button>
                                                <input type="number" readOnly value={quantity} className='border-none w-14 text-center p-1' />
                                                <button onClick={increaseQuantity} className='bg-gray-100 p-2 hover:bg-gray-200 transition-all'>
                                                    <AddIcon />
                                                </button>
                                            </div>
                                            <button type='submit' disabled={product.stock < 1 ? true : false} className='font-medium rounded-full bg-violet-500 py-3 px-7 text-white hover:bg-violet-600 shadow-sm'>Add to Cart</button>
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
                            <h1 className='text-lg font-bold text-gray-600 px-1 border-b-2 border-gray-300 w-fit'>Reviews</h1>
                            {reviews.map((review, ind) => {
                                const { id, name, rating, comment, reviewedAt } = review
                                const options = {
                                    value: rating,
                                    readOnly: true,
                                    precision: 0.5
                                }
                                return (
                                    <div key={id} className="relative mt-9 flex items-center gap-x-4 border-b last:border-b-0 border-gray-200 pb-4">
                                        <img src={imageUrl} alt="avatar" className="h-10 w-10 rounded-full bg-gray-50 self-start" />
                                        <div className="text-sm leading-6">
                                            <p className="font-semibold text-gray-900">
                                                {name}
                                            </p>
                                            <p>{reviewedAt}</p>
                                            <Rating {...options} size='small' className='my-3' />
                                            <p>{comment}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </section>
                </>
            }