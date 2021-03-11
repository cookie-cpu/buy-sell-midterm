/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  // # BROWSE - view all favorite per user
  router.get("/", (req, res) => {

    db.query(`
    SELECT * FROM favorites
    JOIN items ON item_id = items.id
    WHERE favorites.user_id = $1;`, [req.session.user_id])
      .then(data => {
        const favorites = data.rows;
        res.render("favorites", {favorites, userID:req.session.user_id});
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });


  // # ADD - create fav connection
  // * POST /favorites
  router.post('/:id', (req, res) => {

    db.query(`INSERT INTO favorites (user_id, item_id)
    VALUES ($1, $2) RETURNING *;`,[req.session.user_id, req.params.id])//TODO add user cookie
      .then(data => {
        //const items = data.rows[0];
        res.redirect('/items');
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  // DELETE
  router.post('/:id/delete', (req, res) => {

    db.query(`DELETE FROM favorites
      WHERE user_id = $1
      AND item_id = $2;`,
      [req.session.user_id, req.params.id]) //TODO add cookies
      .then(data => {
        //const items = data.rows[0];
        res.redirect('/favorites');
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.get('/:id', (req, res) => {
    res.redirect('/favorites');
  });

  return router;
};
