const express = require("express");
const session = require("express-session");
const routes = require("./routes");
const bodyParser = require("body-parser");
const passport = require("passport");
const cors = require("cors");
const path = require("path");
const LocalStrategy = require("passport-local").Strategy;

const { getByUsernamePassword, getById } = require("./controller/User");
const isAuthenticated = require("./middlewares/isAuthenticated");

const app = express();
app.use(cors());

app.use(
  session({
    secret: "something",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 86400000,
    },
  })
);

// Passport auth

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  getById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(
  new LocalStrategy(function (username, password, done) {
    getByUsernamePassword(username, password, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, {
          message: "Incorrect username or password.",
        });
      }
      return done(null, user);
    });
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

try {
  // commenting for debugging locally
  // uncomment the following lines for deplopyment

  // app.use(express.static(path.join(__dirname, 'build')))
  // app.get('/', ( req, res ) =>{
  //   res.sendFile( path.join(__dirname, 'build', 'index.html'))
  // })

  // app.get('/teacher/*', ( req, res ) =>{
  //   res.sendFile( path.join(__dirname, 'build', 'index.html'))
  // })
  // app.get('/admin/*', ( req, res ) =>{
  //   res.sendFile( path.join(__dirname, 'build', 'index.html'))
  // })

  app.get("/user", function (req, res) {
    if (req.isAuthenticated()) {
      res.send(JSON.stringify(req.user));
    } else {
      res.sendStatus(401);
    }
  });

  app.post("/API/login", function (req, res, next) {
    passport.authenticate("local", function (err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.sendStatus(401);
      }
      req.logIn(user, function (err) {
        if (err) {
          return next(err);
        }
        console.log("user authenticated");
        return res.sendStatus(200);
      });
    })(req, res, next);
  });

  app.get("/API/logout", (req, res, next) => {
    console.log("User logged out successfully");
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.sendStatus(200);
    });
  });

  app.use(
    "/API",
    // comment line below to allow unauthenticated users
    isAuthenticated,
    routes
  );

  app.get("/test", (req, res) => {
    res.send(JSON.stringify("Server is running"));
  });
  app.get("/*any", (req, res) => {
    res.sendStatus(404);
  });

  //PORT
  const port = 9132;
  app.listen(port, "0.0.0.0", () => console.log(`Listening on port ${port}`));
} catch (error) {
  console.error(error);
}
