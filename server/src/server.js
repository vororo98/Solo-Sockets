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
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../client/dist/index.html"));
  });

app.get("/", (req, res, next) => {
    console.log("get route", req.testing);
    res.end();
});

app.ws("/", (req, res, next) => {
    ws.on("message", (msg) => {
        console.log(msg);
    });
    console.log("socket", req.testing);
});




app.listen(port, () => {
  console.log(`Server is listening on port ${port}.`);
});