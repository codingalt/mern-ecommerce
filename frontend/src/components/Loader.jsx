import React from 'react'
import styled from 'styled-components'

const Loader = () => {
  return (
    <Wrapper className='loading'>
        <div></div>
    </Wrapper>
  )
}

const Wrapper = styled.div`
    width: 100vw;
    height: 100vh;
    background-color: white;
    display: grid;
    place-items: center;
    max-width: 100%;
    > div{
        width: 120px;
        height: 120px;
        border-bottom: 5px solid rgba(0, 0, 0, 0.795);
        border-radius: 50%;
        animation: loadingRotate 900ms linear infinite;
    }
    @keyframes loadingRotate {
        to{
            transform: rotateZ(-360deg);
        }
    }
`

export default Loader