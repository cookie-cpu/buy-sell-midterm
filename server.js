// load .env data into process.env
require('dotenv').config();

// Web server config
const PORT       = process.env.PORT || 8080;
const ENV        = process.env.ENV || "development";
const express    = require("express");
const bodyParser = require("body-parser");
const sass       = require("node-sass-middleware");
const app        = express();
const morgan     = require('morgan');
const cookieSession = require('cookie-session');

// PG database client/connection setup
const { Pool } = require('pg');
const dbParams = require('./lib/db.js');
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],
}));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes = require("./routes/users");
const widgetsRoutes = require("./routes/widgets");
const itemsRoutes = require("./routes/items");
const favoritesRoutes = require("./routes/favorites");
const messagesRoutes = require("./routes/messages");
const searchRoutes = require("./routes/search")

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/users", usersRoutes(db));
app.use("/items", itemsRoutes(db));
app.use("/favorites", favoritesRoutes(db))
app.use("/messages", messagesRoutes(db))
app.use("/items/search", searchRoutes(db))
app.use("/api/widgets", widgetsRoutes(db));

// Note: mount other resources here, using the same pattern above


// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).
app.get("/", (req, res) => {
  //res.render("index", {userID:req.session.user_id});
  const userID = req.session.user_id
  const featuredPosts = [(Math.floor(Math.random() * 10) + 1),(Math.floor(Math.random() * 10) + 1),(Math.floor(Math.random() * 10) + 1)];
  console.log(`Today's featuredPosts IDs are ${featuredPosts}`)
  db.query(`
  SELECT * FROM items
  WHERE id = $1
  OR id = $2
  OR id = $3
  ;`,featuredPosts)
    .then(data => {
      // console.log('the get / data is: ', data)
      const items = data.rows;
      res.render('featureditems', {items, userID});
      //res.json({ items });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});


// User login route
app.get('/login/:id', (req, res) => {
  req.session.user_id = req.params.id;
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
