const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");

const port = process.env.PORT || 5100;
app.use(express.json());
app.use(cors());
app.use(express.static("../client/dist"));



//serving static html for every path
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../client/dist/index.html"));
  });



  
app.listen(port, () => {
  console.log(`Server is listening on port ${port}.`);
});