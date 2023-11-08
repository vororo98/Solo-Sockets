const knex = require("../knex");
const users = "users";

module.exports = {
    users,
    getUser(user_name, password) {
        return knex
        .select({
            id: "id",
            user_name: "user_name",
            hashed_password: "hashed_password",
            salt: "salt",
        }).from(users)
        .where({user_name: user_name,
            hashed_password: password})
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
}