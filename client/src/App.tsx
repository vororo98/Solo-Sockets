import { useState, useEffect, useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  const socketRef = useRef<WebSocket | null>(null);

  // Create WebSocket connection. Define behaviour. wss://super-robot-programmer.onrender.com/echo ws://localhost:5100/echo
  useEffect(() => {
    socketRef.current = new WebSocket("wss://super-robot-programmer.onrender.com/echo");
    const socket = socketRef.current;

     // Connection opened
     socket.addEventListener("open", () => {
      socket.send("Hello Server!");
    });
    
    //Connection closed
    socket.addEventListener("close", () => {
      console.log("closed socket");
    })

    // Listen for messages
    socket.addEventListener("message", (event) => {
      testNumber =+ testNumber + 1;
      console.log("Message from server " + testNumber, event.data);
    });    
  }, []);

  
  let testNumber: Number = 0;

 

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => {
          if(socketRef.current != null) socketRef.current.send("I AM DOING IT AGAIN");
          setCount((count) => count + 1)}}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
