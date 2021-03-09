const express = require('express');
const router  = express.Router();


// SEARCH items by price

module.exports = (db) => {
  router.post("/price", (req, res) => {

    // console.log('req.body', req.body)

    // 1 Setup an array to hold any parameters that may be available for the query.
    const queryParams = [];

    //  // 2 Start the query with all information that comes before the WHERE clause.
    let queryString = `
   SELECT *
   FROM items
   `;

    // 3 Check if a min an max price for item has been passed in. Add them to the params array and create a WHERE clause.


    if ((req.body).minimum_price_per_item && (req.body).maximum_price_per_item) {
      queryParams.push((req.body).minimum_price_per_item, (req.body).maximum_price_per_item);
      if (queryParams.length === 2) {
        queryString += `WHERE price >= $${queryParams.length - 1} AND price <= $${queryParams.length}`;
      } else {
        queryString += `AND price >= $${queryParams.length - 1} AND price <= $${queryParams.length}`;
      }
    }


    console.log('searchJS: queryString', queryString);
    console.log('searchJS: queryParams', queryParams);
    db.query(queryString, queryParams)
      .then(data => {
        const items = data.rows;
        res.render('items', {items, userID:req.session.user_id});
      });

  });

  return router;
};
