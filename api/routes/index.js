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
  res.send(req.user);
});

router.get("/secret", (req, res) => {
  req.user ? res.send("cake.jpg") : res.sendStatus(401);
});
// router.post("/logout", (req, res) => {
//   req.logout();
//   res.redirect("/"); // El redirect, es tarea del front, estamos en back ahora. Se puede evitar el redireccionamiento.
// });
router.post("/logout", (req, res) => {
  req.logOut();
  res.sendStatus(200);
});

router.get("/me", (req, res) => {
  !req.user ? res.sendStatus(401) : res.send(req.user);
});

// Don´t modify this route, keep it at the bottom.
router.use("/", function (req, res) {
  res.sendStatus(404);
});

module.exports = router;
