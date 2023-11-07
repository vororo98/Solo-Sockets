import { useState, useEffect, useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Canvas from './Canvas'
//require("dotenv")
//const DB_URL = process.env.DATABASE_URL;¨

function App() {
  //const [count, setCount] = useState(0)
  const [player, setPlayer] = useState(0);
  //const arena = [0,1,2,3,4,5,6];
  const [p1Pos, setP1Pos] = useState(2);
  const [p2Pos, setP2Pos] = useState(4);
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
    socket.addEventListener("message", (event) => {
      handleMessage(event.data);
    });    
  }, []);

  //Handlers
  async function handleMessage(msg: string){
    let parsedMessage = await JSON.parse(msg);
    switch(parsedMessage.type) {
      case "ball":
        //setCount((count) => count + 1);
        console.log("Ball spawned by player: " + parsedMessage.player);
      break;
      case "player":
        setPlayer(parsedMessage.player);
        break;
      case "move":
        if(parsedMessage.player == 1){
          if(parsedMessage.direction == "left"){
            setP1Pos((p1Pos) => p1Pos - 1);
          }
          else{
            setP1Pos((p1Pos) => p1Pos + 1);
          }
        }
        else if(parsedMessage.player == 2){
          if(parsedMessage.direction == "left"){
            setP2Pos((p2Pos) => p2Pos - 1);
          }
          else{
            setP2Pos((p2Pos) => p2Pos + 1);
          }
        }
        break;
      default:
        console.log("unknown message type");
    }
  }

  const drawer = (ctx: CanvasRenderingContext2D, frameCount: number) => {
    ctx.fillStyle = '#000000'
    ctx.beginPath()
    ctx.arc(50 + 50 * p1Pos, 100, 20*Math.sin(frameCount*0.05)**2, 0, 2*Math.PI)
    ctx.arc(50 + 50 * p2Pos, 100, 20*Math.sin(frameCount*0.05)**2, 0, 2*Math.PI)
    ctx.fill()
  }

  // let fired = false
  // document.body.addEventListener('keydown', function(event) {
  //   if (fired || event.repeat) return;
  //   fired = true;
  //   let boolTest = false;
  //   console.log(event.key);
  //   if(event.key == "arrowRight" && !boolTest){
  //     boolTest = true;
  //     if(socketRef.current != null) socketRef.current.send("right")
  //   }
  //   else if(event.key == "arrowLeft" && !boolTest) {
  //     boolTest = true;
  //     if(socketRef.current != null) socketRef.current.send("left")
  //   }
  // });

  // document.body.addEventListener("keyup", function() {
  //   fired = false;
  // });

 

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
      <div tabIndex={0} onKeyDown={() => console.log('key pressed')}>
          Some div
          </div>;
      <Canvas draw={drawer}>Hi</Canvas>
      <div className="card">
        <button onClick={() => {
          if(socketRef.current != null) socketRef.current.send("right");
          }}>
          player {player} right
        </button>
        <button onClick={() => {
          if(socketRef.current != null) socketRef.current.send("left");
          }}>
          player {player} left
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
