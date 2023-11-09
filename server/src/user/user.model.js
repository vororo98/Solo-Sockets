const knex = require("../knex");
const users = "users";

module.exports = {
    users,
    getByName(user_name) {
        return knex
        .select({
            id: "id",
            user_name: "user_name",
            wins: "wins",
            losses: "losses"
        }).from(users)
        .where({user_name: user_name})
    },
    // check before register
    checkUser(user_name) {
        return knex
        .select({
            id: "id",
            user_name: "user_name",
            hashed_password: "hashed_password",
            wins: "wins",
            losses: "losses",
        }).from(users)
        .where({user_name: user_name})
    },

    getById(id) {
        return knex.select({
            id: "id",
            user_name: "user_name",
            hashed_password: "hashed_password",
            wins: "wins",
            losses: "losses",
        }).from(users)
        .where({id: id})
        .first();
    },

    create(user) {
        return knex(users)
        .returning({id: 'id', user_name: "user_name", hashed_password: "hashed_password"})
        .insert([user]);
    },

    update(user) {
        return knex(users)
        .where("user_name", "=", user.user_name)
        .returning("id")
        .update(user)
        .then((res) => {
          return res[0].id;
        });
    },
}