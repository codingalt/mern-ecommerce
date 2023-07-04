import React, { useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Loader from '../Loader'
import MetaData from '../MetaData'

const Profile = () => {
    const { loading, user, isAuthenticated } = useSelector((state) => state.user);
    const navigate = useNavigate()
    useEffect(() => {
        if (isAuthenticated === false) {
            navigate("/login")
        }
    }, [isAuthenticated, navigate])
    return (
        <>
            {loading ? <Loader /> :
                <>
                    <MetaData title={`${user.name}'s profile`} />
                    <div className='pt-32 pb-16'>
                        <div className="w-[90%] md:w-[80%] mx-auto grid grid-cols-1 lg:grid-cols-6 lg:gap-x-5 gap-y-10">
                            <div className="col-span-full lg:col-span-3 flex flex-col gap-5 items-center">
                                <h2 className='text-xl font-bold'>My Profile</h2>
                                <div className="flex rounded-full bg-gradient-to-tr from-pink-500 to-violet-500 p-1 shadow-sm shadow-violet-500">
                                    <img src={user?.avatar?.url} alt={user.name} className='h-60 w-60 rounded-full object-cover ' />
                                </div>
                                <NavLink to="/me/update" className='bg-gradient-to-tr from-pink-500 to-violet-500 hover:from-pink-600-600 hover:to-violet-600 inline-block w-60 md:w-72 p-3 text-center text-white font-bold shadow-sm shadow-violet-500'>Edit Profile</NavLink>
                            </div>
                            <div className="col-span-full lg:col-span-3 flex flex-col gap-5 justify-between">
                                <div>
                                    <h3 className='text-lg font-bold'>Full Name</h3>
                                    <p className=''>{user.name}</p>
                                </div>
                                <div>
                                    <h3 className='text-lg font-bold'>Email</h3>
                                    <p className=''>{user.email}</p>
                                </div>
                                <div>
                                    <h3 className='text-lg font-bold'>Joined On</h3>
                                    <p>{user.createdAt.slice(0,10)}</p>
                                </div>
                                <div className='flex flex-col gap-5'>
                                    <NavLink to="/orders" className='bg-gray-400 hover:bg-gray-500 max-w-xs p-3 text-center text-white font-bold shadow-lg'>My Orders</NavLink>
                                    <NavLink to="/password/update" className='bg-gray-400 hover:bg-gray-500 max-w-xs p-3 text-center text-white font-bold shadow-lg'>Change Password</NavLink>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            }
        </>
    )
}

export default Profile