import { useState, useEffect, useRef } from 'react'
import './App.css'
import Canvas from './Canvas'
//require("dotenv")
//const DB_URL = process.env.DATABASE_URL;¨

function App() {
  const [player, setPlayer] = useState(0);
  //const arena = [0,1,2,3,4,5,6];
  const [p1Pos, setP1Pos] = useState(2);
  const [p2Pos, setP2Pos] = useState(4);
  const [p1Hp, setP1Hp] = useState(3);
  const [p2Hp, setP2Hp] = useState(3);
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
      let message = JSON.stringify({"type": "greeting", "body": "Hello Server!"});
      socket.send(message);
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

  useEffect(() => {
    if(p1Hp <= 0) {
      console.log("player 2 wins");
      socketRef.current?.send(`{"type": "reset"}`);
    }
    else if(p2Hp <= 0) {
      console.log("player 1 wins");
      socketRef.current?.send(`{"type": "reset"}`);
    }
  }, [p1Hp, p2Hp]);

  //Handlers
  async function handleMessage(msg: string){
    let parsedMessage = await JSON.parse(msg);
    switch(parsedMessage.type) {
      case "message":
        console.log(parsedMessage.body);
      break;
      case "player":
        setPlayer(parsedMessage.player);
        break;
      case "actions":
        handleActions(parsedMessage);
        break;
      default:
        console.log("unknown message type");
    }
  }

  //obj {player: number, actions: []
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
        if (currActions[0][i - 1] == "left" || currActions[0][i - 1] == "right") handleMovement(i, currActions[0][i - 1]);
        else if (currActions[0][i - 1] == "attack") handleAttack(i);
      }
      if(actions.length > 0) parseActions(actions);
    }, 1000);
    return () => clearTimeout(timeout);
  }

  const handleAttack = (player: number) =>{
    if(player == 1) {
      //TODO: POLISH: animate a miss
      //p1 is the left player
      if(p1Pos + 1 == p2Pos) setP2Hp((prevHp) => prevHp - 1);
    }
    else if(player == 2){
      if(p2Pos - 1 == p1Pos) setP1Hp((prevHp) => prevHp - 1);
    }
  }

  const handleMovement = (player: number, dir: string) => {
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
      <h1>Super Robot Programmer!!!</h1>
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
        <button onClick={() => {
          socketRef.current?.send(`{"type": "reset"}`);
          }}>
          RESET GAME DO NOT PRESS
        </button>
      </div>
    </>
  )
}

export default App
