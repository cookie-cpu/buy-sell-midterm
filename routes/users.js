const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  // BROWSE - view all items listed by a specific user ==> GET  /items/:user_id
  router.get("/:user_id", (req, res) => {

    const userID = parseInt(req.session.user_id, 10);

    db.query(`
    SELECT items.*, users.name as username
    FROM items
    JOIN users ON user_id = users.id
    WHERE user_id = $1;
    `, [userID])
      .then(data => {
        const items = data.rows;
        res.render('items', {items: items, userID});
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  return router;
};
