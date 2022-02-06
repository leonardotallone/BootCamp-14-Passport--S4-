"use strict";

const Sequelize = require("sequelize");

const db = new Sequelize("passport", null, null, {
  host: "localhost",
  dialect: "postgres",
  logging: false,
});

module.exports = db;
