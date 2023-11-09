const userModel = require("./user.model");
const crypter = require("../hasher");

module.exports = {
    async create(req, res) {
        try {
          let user = req.body;
          let checkUser = await userModel.checkUser(user.user_name);
          if (checkUser[0]) {
            return res.status(404).send("Username already exist");
          } else {
            let hashedData = await crypter.hash(user.password);
    
            let obj = {
              user_name: user.user_name,
              hashed_password: hashedData.hashedPassword,
            };
            userCreated = await userModel.create(obj);
    
            res.status(200).send(userCreated);
          }
        } catch (err) {
          res.status(500).send("Server problem.");
        }
      },

      async getCurrentUser(req, res) {
        try{
        let result = await userModel.getByName(req.session.user);
        let msg = JSON.stringify(result);
        console.log(msg);
        res.status(200).send(msg);
        } catch (err) {
          res.status(500).send("session user does not exist");
        }
      },

      async login(data) {
        const user = await userModel.checkUser(data.user_name);
        if(user[0] == undefined) return false;
        const validUser = await crypter.check(
          data.password,
          user[0].hashed_password
        );
        if (validUser === true) {
          return true;
        } else {
          return false;
        }
      },

      async updateWins(str) {
        let result = await userModel.getByName(str);
        userModel.update({"user_name": result[0].user_name, "wins": result[0].wins + 1});
        //res.sendStatus(200);
      },
      async updateLosses(str) {
        let result = await userModel.getByName(str);
        userModel.update({"user_name": result[0].user_name, "losses": result[0].losses + 1});
        //res.sendStatus(200);
      },
};