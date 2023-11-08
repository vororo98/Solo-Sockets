const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
var expressWs = require("express-ws")(app);

const port = process.env.PORT || 5100;
app.use(express.json());
app.use(cors());
app.use(express.static("../client/dist"));

app.use(function (req, res, next) {
    console.log("middleware");
    req.testing = "testing";
    return next();
});



//serving static html for every path
// app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "../../client/dist/index.html"));
//   });

app.get("/", (req, res, next) => {
    console.log("get route", req.testing);
    res.end();
});

let i = 0;
app.ws('/echo', function(ws, req) {
    ws.on('message', function(msg) {
      i++;
      console.log(msg + " " + i);
      expressWs.getWss().clients.forEach(function (client) {
        client.send("Recieved message: " + i + " " + msg);
      });
    });
    console.log('socket', req.testing);
  });

  let testPlayerID = 1;
app.ws("/game", function(ws, req) {
  ws.send(`{"type": "player", "player": ${testPlayerID}}`);
  ws["PLAYERID"] = testPlayerID;
  testPlayerID++;
  ws.on("message", async function(msg) {
    console.log(typeof msg)
    
    let id = ws.PLAYERID;
    if(msg == "add") {
      expressWs.getWss().clients.forEach(function (client) {
        client.send(`{"type": "ball", "color": "#ff0000", "player": ${id}}`);
      });
    }
    else if(msg == "right") {
      expressWs.getWss().clients.forEach(function (client) {
        client.send(`{"type": "move", "direction": "right", "player": ${id}}`);
      });
    }
    else if(msg == "left") {
      expressWs.getWss().clients.forEach(function (client) {
        client.send(`{"type": "move", "direction": "left", "player": ${id}}`);
      });
    }
    else {
      let parsedMessage = await JSON.parse(msg);
      console.log(parsedMessage);
      let response = JSON.stringify({"type": "actions", "actions": parsedMessage.actions, "player": id});
      console.log(response);
      expressWs.getWss().clients.forEach(function (client) {
        client.send(response);
      });
    }
  });
})


app.listen(port, () => {
  console.log(`Server is listening on port ${port}.`);
});