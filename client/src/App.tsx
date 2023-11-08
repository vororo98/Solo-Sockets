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
  const [p1Pos, setP1Pos] = useState(3);
  const [p2Pos, setP2Pos] = useState(4);
  const [plan, setPlan] = useState<Array<string>>([]);
  const [p1Actions, setp1Actions] = useState<Array<string>>([]);
  const [p2Actions, setp2Actions] = useState<Array<string>>([]);
  const posRef = useRef<number>();
  posRef.current = p1Pos;
  const socketRef = useRef<WebSocket | null>(null);

  // Create WebSocket connection. Define behaviour. wss://super-robot-programmer.onrender.com/echo ws://localhost:5100/echo
  useEffect(() => {
    socketRef.current = new WebSocket("ws://localhost:5100/game");
    const socket = socketRef.current;

     // Connection opened
     socket.addEventListener("open", () => {
      //socket.send("Hello Server!");
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

  useEffect(() => {
    if(plan.length == 3){
      let message = JSON.stringify({"type": "actions", "actions": plan});
      socketRef.current!.send(message);
      setPlan([]);
    }
  }, [plan]);

  useEffect(() => {
    if(p1Actions.length == 3 && p2Actions.length == 3){
      let arr = [];
      for(let i = 0; i < p1Actions.length; i++){
        arr[i] = [p1Actions[i], p2Actions[i]];
      }
      setp1Actions([]);
      setp2Actions([]);
      parseActions(arr);
    }
  }, [p1Actions, p2Actions]);

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
        handleMovement(parsedMessage);
        break;
      case "actions":
        handleActions(parsedMessage);
        break;
      default:
        console.log("unknown message type");
    }
  }

  //obj {type: actions, p1Actions: [1,2,3,], p2Actions: [1,2,3]}
  const handleActions = (msg: any) => {
    if(msg.player == 1) setp1Actions(msg.actions);
    else if(msg.player == 2) setp2Actions(msg.actions);

    
  }

  //actions: string, "left", "right", "attack", Array array [0] p1, [1] p2
  const parseActions = (actions: Array<Array<string>>) => {
    const timeout = setTimeout(() => {
      let currActions = actions.splice(0,1);
      console.log("parsing: " + currActions);
      for(let i = 1; i <= 2; i++) {
        if (currActions[0][i - 1] == "left" || currActions[0][i - 1] == "right") newHandleMovement(i, currActions[0][i - 1]);
        else if (currActions[0][i - 1] == "attack") handleAttack(i);
      }
      if(actions.length > 0) parseActions(actions);
    }, 1000);
    return () => clearTimeout(timeout);
  }

  const handleAttack = (player: number) =>{
    if(player == 1) console.log("player 1 attacks");
    else if(player == 2) console.log("player 2 attacks");
  }

  const newHandleMovement = (player: number, dir: string) => {
    if(player == 1){
      if(dir == "left"){
        setP1Pos((p1Pos) => {
          if (p1Pos - 1 >= 0) return p1Pos - 1;
          return 0});
      }
      else if(dir == "right"){
        setP1Pos((p1Pos) => {
          if(p1Pos + 1 <= 6) return p1Pos + 1;
          return 6});
      }
    }
    else if(player == 2){
      if(dir == "left"){
        setP2Pos((p2Pos) => {
          if(p2Pos - 1 >= 0) return p2Pos - 1;
          return 0});
      }
      else if(dir == "right"){
        setP2Pos((p2Pos) => {
          if(p2Pos + 1 <= 6) return p2Pos + 1;
          return 6});
      }
    }
  }

  const handleMovement = (msg: any) => {
    if(msg.player == 1){
      if(msg.direction == "left"){
        setP1Pos((p1Pos) => {
          if (p1Pos - 1 >= 0) return p1Pos - 1;
          return 0});
      }
      else{
        setP1Pos((p1Pos) => {
          if(p1Pos + 1 <= 6) return p1Pos + 1;
          return 6});
      }
    }
    else if(msg.player == 2){
      if(msg.direction == "left"){
        setP2Pos((p2Pos) => {
          if(p2Pos - 1 >= 0) return p2Pos - 1;
          return 0});
      }
      else{
        setP2Pos((p2Pos) => {
          if(p2Pos + 1 <= 6) return p2Pos + 1;
          return 6});
      }
    }
  }

  const drawer = (ctx: CanvasRenderingContext2D, frameCount: number) => {
    ctx.fillStyle = '#000000'
    ctx.beginPath()
    ctx.arc(50 + 50 * p1Pos, 100, 20*Math.sin(frameCount*0.05)**2, 0, 2*Math.PI)
    ctx.arc(50 + 50 * p2Pos, 100, 20*Math.sin(frameCount*0.05)**2, 0, 2*Math.PI)
    ctx.fill()
  }

  const addToPlan = (item: string) => {
    if(plan.length < 3) setPlan((prevPlan) => [...prevPlan, item]);
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
      <div tabIndex={0} onKeyDown={() => console.log('key pressed')}>
          Some div
          </div>;
      <Canvas draw={drawer}>Hi</Canvas>
      <div className="card">
        <button onClick={() => {
          addToPlan("left");//socketRef.current.send("left");
          }}>
          player {player} left
        </button>
        <button onClick={() => {
          addToPlan("attack");
          }}>
          player {player} attack
        </button>
        <button onClick={() => {
          addToPlan("right");
          }}>
          player {player} right
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
