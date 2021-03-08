/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  // BROWSE - view all items listed by a specific user ==> GET  /items/:user_id (JOIN users ON users.id = user_id, GROUP BY items.id)

  router.get("/:user_id", (req, res) => {
    db.query(`
    SELECT * FROM items
    WHERE user_id = $1;
    `, [req.params.user_id])
    console.log('USERS BROWSE GET - req.params.user_id',req.params.user_id)
      .then(data => {
        const items = data.rows;
        res.render('items', {items});
        // res.json({ users });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });



  // READ - view specific item listed by a specific user ==> GET  /items/:user_id/:id

  // router.get("/:user_id", (req, res) => {
  //   db.query(`
  //   SELECT * FROM items
  //   JOIN users ON users.id = user_id
  //   WHERE users.id = $1;
  //   GROUP BY items.id`, [req.params.id])
  //     .then(data => {
  //       const items = data.rows;
  //       res.render('items', {items});
  //       // res.json({ users });
  //     })
  //     .catch(err => {
  //       res
  //         .status(500)
  //         .json({ error: err.message });
  //     });
  // });







  return router;
};
