import React from 'react'
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import { NavLink } from 'react-router-dom';

const Footer = () => {
    return (
        <div className='bg-blue-950 pt-20 text-sm text-white'>
            <div className="w-[90%] mx-auto grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-20 text-center xs:text-left">
                <div className="footer-1">
                    <NavLink href="/" className="footer-logo"><h4 className='text-xl font-semibold'>ECOMMERCE</h4></NavLink>
                    <p className='text-sm mt-4'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quasi cum quis delectus.</p>
                </div>
                <div className="footer-2">
                    <h4 className='mb-5 text-white font-bold'>Permalinks</h4>
                    <ul className="permalinks">
                        <li className='mb-3'><NavLink to='' className='hover:underline'>Home</NavLink></li>
                        <li className='mb-3'><NavLink to='' className='hover:underline'>About</NavLink></li>
                        <li className='mb-3'><NavLink to='' className='hover:underline'>Courses</NavLink></li>
                        <li className='mb-3'><NavLink to='' className='hover:underline'>Contact</NavLink></li>
                    </ul>
                </div>
                <div className="footer-3">
                    <h4 className='mb-5 text-white font-bold'>Privacy</h4>
                    <ul className="privacy">
                        <li className='mb-3'><NavLink to='' className='hover:underline'>Privace Policy</NavLink></li>
                        <li className='mb-3'><NavLink to='' className='hover:underline'>Terms and Conditions</NavLink></li>
                        <li className='mb-3'><NavLink to='' className='hover:underline'>Refund Policy</NavLink></li>
                    </ul>
                </div>
                <div className="footer-4">
                    <h4 className='mb-5 text-white font-bold'>Contact Us</h4>
                    <div>
                        <p>+92 301 2348910</p>
                        <p>ecommerce999@gmail.com</p>
                    </div>
                    <div className="mt-8 flex gap-4 justify-center xs:justify-normal">
                        <li className='mb-3'> <NavLink to=''> <FacebookIcon style={{fontSize: '25px', color: 'white'}}/> </NavLink> </li>
                        <li className='mb-3'> <NavLink to=''> <InstagramIcon style={{fontSize: '25px', color: 'white'}}/> </NavLink> </li>
                        <li className='mb-3'> <NavLink to=''> <LinkedInIcon style={{fontSize: '25px', color: 'white'}}/> </NavLink> </li>
                        <li className='mb-3'> <NavLink to=''> <TwitterIcon style={{fontSize: '25px', color: 'white'}}/> </NavLink> </li>
                    </div>
                </div>
            </div>
            <div className="text-center py-5 mt-5 lg:mt-16 border-t-2 border-blue-900">
                <small>Copyright &copy; Ecommerce</small>
            </div>
        </div>
    )
}

export default Footer