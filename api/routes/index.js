const express = require("express");
const router = express.Router();
const db = require("./db");
const User = require("../../User");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

router.post("/register", (req, res) => {
  User.create(req.body).then((user) => {
    res.status(201).send(user);
  });
});

router.post("/login", passport.authenticate("local"), (req, res) => {
  console.log(req);
  res.send(req.user);
});

router.post("/logout", (req, res) => {
  req.logout();
  res.redirect('/');
});


// Don´t modify this route, keep it at the bottom.
router.use("/", function (req, res) {
  res.sendStatus(404);
});

module.exports = router;
