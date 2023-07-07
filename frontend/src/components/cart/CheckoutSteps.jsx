import React from 'react'
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
// import styled from 'styled-components';

const CheckoutSteps = ({ activeStep }) => {
    const steps = [
        {
            label: <p>Shipping Details</p>,
            icon: <LocalShippingIcon style={{ fontSize: '18px' }}/>
        },
        {
            label: <p>Confirm Order</p>,
            icon: <LibraryAddCheckIcon style={{ fontSize: '18px' }}/>
        },
        {
            label: <p>Payment</p>,
            icon: <AccountBalanceIcon style={{ fontSize: '20px' }}/>
        },
    ]
    return (
        <div className=''>
            <div className="border border-gray-400 rounded-lg py-3 md:p-3 mb-5">
                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((item, index) => (
                        <Step key={index} active={activeStep === index ? true : false} completed={activeStep > index ? true : false}>
                            <StepLabel icon={item.icon}>{item.label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </div>
        </div>
    )
}

export default CheckoutSteps