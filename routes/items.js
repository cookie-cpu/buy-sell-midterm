/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();


// BROWSE - view homepage ==> GET /items

module.exports = (db) => {

  router.get("/", (req, res) => {
    db.query(`SELECT * FROM items;`)
      .then(data => {
        console.log('the get / data is: ', data.rows)
        const items = data.rows;
        res.render("items", {items});
        //res.json({ items });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
    });

// READ - view specific item's page ==> GET /items/:id

  router.get("/:id", (req, res) => {
    console.log('the get/:id req.params.id is:', req.params.id);
    db.query(`SELECT * FROM items WHERE id = $1`,[req.params.id])
      .then(data => {
        console.log('the get /:id data is: ', data.rows[0])
        const item = data.rows[0];
        res.render("item_singular", {item});  // make new  item.ejs . no for loop need.
        //res.json({ items });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
    });

// EDIT - admin edit data ==> POST /items/:id

  // router.get("/:id/update", (req, res) => {
  //   res.render("itemUpdate")
  // });


  router.post("/:id", (req, res) => {
    console.log('the post/:id req.params.id is:', req.params.id);
    console.log('the post/:id req.params.id is:', req.body);
    db.query(`UPDATE items SET name = 'daffodli' WHERE id = $1;`,[req.params.id])
      .then(data => {
        console.log('the post /:id data is: ', data.rows[0])
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

    // ADD - admin add item  ==> POST /items

  router.post("/", (req, res) => {
    console.log('req.body is:', req.body)
    db.query(`INSERT INTO items VALUES $1, $2, $3, $4, $5 RETURNING *;`,
    [req.body.name, req.body.description, req.body.price, req.body.photo_url, FALSE])
      .then(data => {
        console.log('the post / data is: ', data.rows[0])
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



  //





    // DELETE - admin delete item ===> POST /items/:id/delete

    // router.post('/items/:id/delete', (req, res) => {
    //   db.query

    // });







    return router;
};
