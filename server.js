const express = require("express");
const helmet = require("helmet");
const http = require("http");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const cookieParser = require ("cookie-parser")
const session = require ("express-session")
const passport = require ("passport")

const db = require("./api/routes/db");
const LocalStrategy = require("passport-local").Strategy;
const User = require ("./user")

const config = require("./server.config.js");

app.use(helmet());

// Express Route File Requires
const authAPI = require("./api/routes");

app.use(express.static(path.resolve(__dirname, "./src/public")));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use(cookieParser()); // popula req.cookies
app.use(session({ secret: "bootcamp" })) // popula req.session

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    function (email, password, done) {
      User.findOne({ where: {email}})
        .then((user) => {
          if (!user) {
            return done(null, false); // user not found
          }
          user.hash(password, user.salt).then((hash) => {
            if (hash !== user.password) {
              return done(null, false); // invalid password
            }
            done(null, user); // success :D
          });
        })
        .catch(done);
    }
  )
);


// How we save the user
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

// How we look for the user
passport.deserializeUser(function (id, done) {
  User.findByPk(id).then((user) => done(null, user));
});

// Express Routing
app.use("/api", authAPI);
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "./src/public", "index.html"));
});

http.createServer(app).listen(config.port, () => {
  console.log(`Server listening at port ${config.port}`);
});


db.sync({ force: false }).then(() => {
  console.log("DB Passport sincronizada!");
});
