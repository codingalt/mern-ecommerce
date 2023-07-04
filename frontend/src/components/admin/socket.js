// socket.js
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const useSocket = () => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const sk = io.connect("http://localhost:4000");
    setSocket(sk);

    return () => {
      sk.disconnect();
    };
  }, []);

  return socket;
};

export default useSocket;
