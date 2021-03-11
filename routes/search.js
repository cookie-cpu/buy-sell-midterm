const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  // SEARCH items by price & description
  router.post("/price", (req, res) => {

    // 1 Setup an array to hold any parameters that may be available for the query.
    const queryParams = [];

    // 2 Start the query with all information that comes before the AND clause.
    let queryString = `
    SELECT *
    FROM items
    WHERE 1 = 1
    `;

    if (req.body.search_text) {
      queryParams.push(`%${req.body.search_text}%`);
      queryString += `
      AND description ILIKE $${queryParams.length}
      OR name ILIKE $${queryParams.length}`;
    }

    if ((req.body).minimum_price_per_item) {
      queryParams.push((req.body).minimum_price_per_item);
      queryString += `AND price >= $${queryParams.length}`;
    }

    if ((req.body).maximum_price_per_item) {
      queryParams.push((req.body).maximum_price_per_item);
      queryString += `AND price <= $${queryParams.length}`;
    }

    db.query(queryString, queryParams)
      .then(data => {
        const items = data.rows;
        res.render('items', {items, userID:req.session.user_id});
      });
  });

  return router;
};

