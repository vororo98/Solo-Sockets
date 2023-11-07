import { useState, useEffect, useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Canvas from './Canvas'

function App() {
  const [count, setCount] = useState(0)

  const socketRef = useRef<WebSocket | null>(null);

  // Create WebSocket connection. Define behaviour. wss://super-robot-programmer.onrender.com/echo ws://localhost:5100/echo
  useEffect(() => {
    socketRef.current = new WebSocket("wss://super-robot-programmer.onrender.com/game");
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
    socket.addEventListener("message", async (event) => {
      testNumber =+ testNumber + 1;
      console.log("Message from server " + testNumber, event.data);
      console.log(typeof event.data);
      let parsedMessage = JSON.parse(event.data);
      if(parsedMessage.type == "ball"){
        setCount((count) => count + 1);
      }
    });    
  }, []);

  
  let testNumber: Number = 0;

  const drawer = (ctx: CanvasRenderingContext2D, frameCount: number) => {
    ctx.fillStyle = '#000000'
    ctx.beginPath()
    for(let i = 0; i < count; i++) {
      ctx.arc(50 + 50 * i, 100, 20*Math.sin(frameCount*0.05)**2, 0, 2*Math.PI)
    }
    ctx.fill()
  }

 

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
      <Canvas draw={drawer}>Hi</Canvas>
      <div className="card">
        <button onClick={() => {
          if(socketRef.current != null) socketRef.current.send("add");
          }}>
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
