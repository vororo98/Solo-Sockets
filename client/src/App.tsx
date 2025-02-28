import { useState, useEffect, useRef } from 'react'
import './App.css'
import Canvas from './Canvas'
import { useNavigate } from "react-router-dom";

function App() {
  const [player, setPlayer] = useState(0);
  //const arena = [0,1,2,3,4,5,6]; //just to show the number of possible positions by players
  const [p1Name, setP1Name] = useState("Waiting");
  const [p2Name, setP2Name] = useState("Waiting");
  const [p1Pos, setP1Pos] = useState(2);
  const [p2Pos, setP2Pos] = useState(4);
  const [p1Hp, setP1Hp] = useState(3);
  const [p2Hp, setP2Hp] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [plan, setPlan] = useState<Array<string>>([]);
  const [p1Actions, setp1Actions] = useState<Array<string>>([]);
  const [p2Actions, setp2Actions] = useState<Array<string>>([]);
  const posRef = useRef<number>();
  posRef.current = p1Pos;
  const socketRef = useRef<WebSocket | null>(null);
  const navigate = useNavigate();

  // Create WebSocket connection. Define behaviour. wss://super-robot-programmer.onrender.com/game ws://localhost:5100/game
  useEffect(() => {
    socketRef.current = new WebSocket("wss://super-robot-programmer.onrender.com/game");
    const socket = socketRef.current;

     // Connection opened
     socket.addEventListener("open", () => {
      let message = JSON.stringify({"type": "greeting", "body": "Hello Server!"});
      socket.send(message);
    });
    
    //Connection closed
    socket.addEventListener("close", () => {
      console.log("closed socket");
      navigate("/profile");
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
    if(p1Hp <= 0 && p2Hp <= 0) {
      setGameOver(true);
    }
    else if(p1Hp <= 0) {
      if(player == 2){
        socketRef.current?.send(`{"type": "victory"}`);
      }
      if(player == 1){
        socketRef.current?.send(`{"type": "defeat"}`);
      }
      setGameOver(true);
    }
    else if(p2Hp <= 0) {
      if(player == 1){
        socketRef.current?.send(`{"type": "victory"}`);
      }
      else if(player == 2){
        socketRef.current?.send(`{"type": "defeat"}`);
      }
      setGameOver(true);
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
        setPlayer(parsedMessage.playerID);
        setP1Name(parsedMessage.player1Name);
        setP2Name(parsedMessage.player2Name);
        break;
      case "actions":
        handleActions(parsedMessage);
        break;
      case "playerNames":

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
      <div className='container-life'>
        <div className='container-life-data'>
        <p>Player 1: <span>{p1Name}</span></p>
        <p>HP: <span>{p1Hp}</span></p>
        </div>
        <div className='container-life-data'>
        <p>Player 2: <span>{p2Name}</span></p>
        <p>HP: <span>{p2Hp}</span></p>
        </div>
      </div>
      <Canvas draw={drawer}>Hi</Canvas>
      <div className="container-input">
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
       
      </div>
      {gameOver ? (
         <button id="game-over-button" onClick={() => {
          socketRef.current?.send(`{"type": "reset"}`);
          }}>
          Game Over.
        </button>
      ) : <></>}
    </>
  )
}

export default App
