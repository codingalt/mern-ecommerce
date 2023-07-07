import React, { useEffect, useRef, useState } from 'react'
import io from 'socket.io-client'
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';

const ENDPOINT = window.location.host.indexOf('localhost') >= 0
    ? 'http://localhost:4000'
    : window.location.host;

const ChatBox = ({ userInfo }) => {
    const [socket, setSocket] = useState(null);
    const uiMessagesRef = useRef(null)
    const [isOpen, setIsOpen] = useState(false)
    const [messageBody, setMessageBody] = useState('');
    const [messages, setMessages] = useState([
        { name: 'Admin', body: 'Hello there, Please ask your question' },
    ])
    useEffect(() => {
        if (uiMessagesRef.current) {
            uiMessagesRef.current.scrollBy({
                top: uiMessagesRef.current.clientHeight,
                left: 0,
                behavior: 'smooth',
            })
        }
        if (socket) {
            socket.emit('onLogin', {
                _id: userInfo._id,
                name: userInfo.name,
                isAdmin: userInfo.role === 'admin' ? true : false
            })
            socket.on('message', (data) => {
                // console.log("message event called on client side")
                // console.log('data: ', data)
                setMessages([...messages, { name: data.name, body: data.body }])
            })
            
        }
    }, [messages, isOpen, socket])

    const supportHandler = () => {
        setIsOpen(true);
        const sk = io.connect(ENDPOINT);
        setSocket(sk);
    }
    const submitHandler = (e) => {
        e.preventDefault();
        if (!messageBody.trim()) {
            alert('Error, Please type message.');
        } else {
            setMessages([...messages, { name: userInfo.name, body: messageBody }])
            setTimeout(() => {
                socket.emit('onMessage', {
                    body: messageBody,
                    name: userInfo.name,
                    isAdmin: userInfo.role === 'admin' ? true : false,
                    _id: userInfo._id
                })
            }, 1000)
            setMessageBody('')
        }
    }
    const closeHandler = () => {
        setIsOpen(false);
    }

    return (
        <>
            {!isOpen ? (
                <button onClick={supportHandler} className='w-12 h-12 fixed bottom-4 right-5 rounded-full hover:bg-gray-200'>
                    <ChatIcon />
                </button>
            ) : (
                <div className='w-80 fixed right-4 bottom-4 border-2 border-gray-300'>
                    <div className='bg-gray-600 text-white flex justify-between p-2'>
                        <strong>Support</strong>
                        <button onClick={closeHandler} className='rounded-full px-0.5 hover:bg-gray-500'>
                            <CloseIcon />
                        </button>
                    </div>
                    <ul ref={uiMessagesRef} className='bg-gray-100 w-full max-h-72 overflow-y-scroll p-2'>
                        {messages.map((msg, ind) => {
                            return (
                                <li key={ind} className='mb-4'>
                                    <strong>{`${msg.name}: `}</strong>
                                    {msg.body}
                                </li>
                            )
                        })}
                    </ul>
                    <form onSubmit={submitHandler} className='flex justify-between border-t-2 border-gray-300'>
                        <input type="text" value={messageBody} placeholder='type message' onChange={(e) => setMessageBody(e.target.value)} className='w-full border border-gray-300 ' />
                        <button type='submit' className='w-12 text-gray-400 bg-white hover:bg-gray-200'>
                            <SendIcon />
                        </button>
                    </form>
                </div>
            )
            }
        </>
    )
}

export default ChatBox