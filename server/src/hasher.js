const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports = {
  hash: hashPassword,
  check: checkPassword,
};

async function hashPassword(password) {
  const newerSalt = await bcrypt.genSalt(saltRounds);
  const newerHash = await bcrypt.hash(password, newerSalt);

  return { hashedPassword: newerHash};
}

async function checkPassword(password, hash) {
  let bool = false;
  bool = await bcrypt.compare(password, hash);
  return bool;
}
