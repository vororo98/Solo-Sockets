const express = require("express");
const userController = require("./user/user.controller");
const app = express();
const path = require("path");
const cors = require("cors");
var expressWs = require("express-ws")(app);
const knex = require("./knex");
const session = require("express-session");
const KnexSessionStore = require("connect-session-knex")(session);
const store = new KnexSessionStore({
  knex,
  tablename: "sessions",
});

app.use(
  session({
    secret: "Controller Armadillo",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000000, // 10 min
    },
    store,
  })
);

function isAuthenticated(req, res, next) {
  console.log(req.session.user);
  if (req.session.user) next();
  else next("route");
}

const port = process.env.PORT || 5100;
app.use(express.json());
app.use(cors());
app.use(express.static("../client/dist"));

app.use(function (req, res, next) {
    console.log("middleware");
    req.testing = "testing";
    return next();
});

app.get("/", (req, res, next) => {
    console.log("get route", req.testing);
    res.end();
});

app.post("/create", userController.create);

app.get("/currentUser", userController.getCurrentUser);

app.patch("/currentUser", userController.updateScore);

// //login user
app.post(
  "/login",
  express.urlencoded({ extended: false }),
  async function (req, res) {
    // login logic to validate req.body.user and req.body.pass
    const loggedIn = await userController.login(req.body);
    if (loggedIn === true) {
      // regenerate the session, which is good practice to help
      // guard against forms of session fixation
      req.session.regenerate(function (err) {
        if (err) next(err);
        console.log("trying to register: " + req.body.user_name)
        // store user information in session, typically a user id
        req.session.user = req.body.user_name;
        // save the session before redirection to ensure page
        // load does not happen before session is saved
        req.session.save(function (err) {
          if (err) return next(err);
          res.sendStatus(200);
        });
      });
    } else {
      res.sendStatus(400);
    }
  }
);

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

  //let testPlayerID = 1; 
app.ws("/game",function(ws, req) {
  if(typeof req.session.user != "string") ws.close();
  console.log("This req comes from: " + req.session.user)  
  
  ws["HASOPPONENT"] = false;
  ws["PLAYERID"] = 0;
  ws["PLAYERNAME"] = req.session.user;
  expressWs.getWss().clients.forEach(function (client) {
    console.log(client.PLAYERNAME)
    if(client.HASOPPONENT == false && ws.HASOPPONENT == false && client.PLAYERNAME != ws.PLAYERNAME){
      ws.PLAYERID = 1;
      client.PLAYERID = 2;
      client.HASOPPONENT = true;
      ws.HASOPPONENT = true;
      ws.send(`{"type": "player", "player": ${ws.PLAYERID}}`);
      client.send(`{"type": "player", "player": ${client.PLAYERID}}`);
    }
  }); 

  ws.on("message", async function(msg) {
    let id = ws.PLAYERID;
    let parsedMessage = await JSON.parse(msg);
    console.log(parsedMessage);

    switch(parsedMessage.type) {
      case "greeting":
        expressWs.getWss().clients.forEach(function (client) {
          console.log(parsedMessage.body)
          client.send(`{"type": "message", "body": "New client connected"}`);
        }); 
      break;
      case "actions":
        let response = JSON.stringify({"type": "actions", "actions": parsedMessage.actions, "player": id});
        console.log(response);
        expressWs.getWss().clients.forEach(function (client) {
        client.send(response);
      });
      break;
      case "reset": {
        testPlayerID = 1;
        expressWs.getWss().clients.forEach((socket) => {
          // Soft close
          socket.close();
        
          process.nextTick(() => {
            if ([socket.OPEN, socket.CLOSING].includes(socket.readyState)) {
              // Socket still hangs, hard close
              socket.terminate();
            }
          });
        });
      }
    }
  });
})

//serving static html for every path
 app.get("*", (req, res) => {
     res.sendFile(path.join(__dirname, "../../client/dist/index.html"));
   });


app.listen(port, () => {
  console.log(`Server is listening on port ${port}.`);
});