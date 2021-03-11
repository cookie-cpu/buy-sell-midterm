/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  // BROWSE - view all items listed by a specific user ==> GET  /items/:user_id

  router.get("/:user_id", (req, res) => {
    const userID = parseInt(req.session.user_id, 10)
    console.log('userid', userID)
    db.query(`
    SELECT items.*, users.name as username
    FROM items
    JOIN users ON user_id = users.id
    WHERE user_id = $1;
    `, [userID])
      .then(data => {
        // console.log('data on line 23', data)
        const items = data.rows;
        const username = data.rows[0].username;
        console.log('items', items)
        console.log('userID', userID)
        console.log('userName', username)
        res.render('items', {items: items, userID, username });
        // res.json({ users });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  return router;
};
