/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();



// <!-- GET /users/favorites -->
// * GET /favorites/:user_id

// # READ - view specific favorite
// * GET /favorites/:id




module.exports = (db) => {

  // # BROWSE - view all favorite per user

  router.get("/", (req, res) => {
    // console.log('query and req.session.user_id', query, [req.session.user_id]);
    db.query( `
    SELECT * FROM favorites
    JOIN items ON item_id = items.id
    WHERE favorites.user_id = $1;`, [req.session.user_id])
      .then(data => {
        // console.log('data rows', data.rows);
        const favorites = data.rows;
        res.render("favorites", {favorites, userID:req.session.user_id});
        //res.json({ items });
        //res.json({ favorites });
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
    //console.log('req.body is:', req.body)
    db.query(`INSERT INTO favorites (user_id, item_id)
     VALUES ($1, $2) RETURNING *;`,[req.session.user_id, req.params.id])//TODO add user cookie
      .then(data => {
      // console.log('the post / data is: ', data.rows)
        //const items = data.rows[0];
        res.redirect('/items');
        //res.json({ items });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  // DELETE
  router.post('/:id/delete', (req, res) => {
    //console.log('req.body is:', req.body)
    db.query(`DELETE FROM favorites
      WHERE user_id = $1
      AND item_id = $2;`,
     [req.session.user_id, req.params.id]) //TODO add cookies
      .then(data => {
        // console.log('the post / data is: ', data.rows)
        //const items = data.rows[0];
        res.redirect('/favorites');
        //res.json({ items });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });



  router.get('/:id', (req, res) => {
    res.redirect('/favorites')
  })






  return router;
};
