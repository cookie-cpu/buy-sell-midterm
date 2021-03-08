/*
 * All routes for items are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();


// BROWSE - view homepage ==> GET /api/items

module.exports = (db) => {

  router.get("/", (req, res) => {
    db.query(`SELECT * FROM items;`)
      .then(data => {
        console.log('the data is: ', data.rows)
        const items = data.rows[0];
        res.render("items", {items});
        //res.json({ items });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
    });

// READ - view specific item's page ==> GET /api/items/:id

  router.get("/:id", (req, res) => {
    console.log('req.params.id is:', req.params.id);
    db.query(`SELECT * FROM items WHERE id = $1`,[req.params.id])
      .then(data => {
        console.log('the data is: ', data.rows[0])
        const items = data.rows[0];
        res.render("items", {items});
        //res.json({ items });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
    });

// EDIT - admin edit data ==> POST /api/items/:id

  router.post("/:id", (req, res) => {
    console.log('req.params.id is:', req.params.id);
    db.query(`UPDATE items SET name = 'daffodli' WHERE id = $1;`,[req.params.id])
      .then(data => {
        console.log('the data is: ', data.rows[0])
        const items = data.rows[0];
        res.redirect('/');
        //res.json({ items });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
    });


    return router;
};
