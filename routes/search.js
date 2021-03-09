const express = require('express');
const router  = express.Router();


 // SEARCH items by price

module.exports = (db) => {
  router.post("/price", (req, res) => {

    console.log('req.body', req.body)

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


 console.log('searchJS: queryString', queryString)
 console.log('searchJS: queryParams', queryParams)
  db.query(queryString, queryParams)
  .then(data => {
    const items = data.rows
    res.render('items', {items, userID:req.session.user_id})
  });

});

  return router;
};


// const getAllProperties = function(options, limit = 10) {
//   // 1 Setup an array to hold any parameters that may be available for the query.
//   const queryParams = [];
//   // 2 Start the query with all information that comes before the WHERE clause.
//   let queryString = `
//   SELECT properties.*, avg(property_reviews.rating) as average_rating
//   FROM properties
//   JOIN property_reviews ON properties.id = property_id
//   `;

  // // Check if a city, owner_id, price_per_night or minumum_rating has been passed in as an option. Add them to the params array and create a WHERE clause.


  // if (options.minimum_price_per_night && options.maximum_price_per_night) {
  //   queryParams.push(options.minimum_price_per_night * 100, options.maximum_price_per_night * 100);
  //   if (queryParams.length === 2) {
  //     queryString += `WHERE cost_per_night >= $${queryParams.length - 1} AND cost_per_night <= $${queryParams.length}`;
  //   } else {
  //     queryString += `AND cost_per_night >= $${queryParams.length - 1} AND cost_per_night <= $${queryParams.length}`;
  //   }
  // }

//4 Add any query that comes after the WHERE clause.
//   queryString += `GROUP BY items.id`;

//   // 5 Console log everything just to make sure we've done it right.
//   console.log(queryString, queryParams);

//   // 6
//   return pool.query(queryString, queryParams)
//   .then(res => res.rows);


// }

  // if (options.city) {
  //   queryParams.push(`%${options.city}%`);
  //   queryString += `WHERE city LIKE $${queryParams.length} `;
  // }


  // if (options.owner_id) {
  //   queryParams.push(options.owner_id);
  //   if (queryParams.length === 1){
  //     queryString += `WHERE owner_id = $${queryParams.length}`;
  //   } else {
  //     queryString += `AND owner_id = $${queryParams.length}`;
  //   }
  // }

  // if (options.minimum_price_per_night && options.maximum_price_per_night) {
  //   queryParams.push(options.minimum_price_per_night * 100, options.maximum_price_per_night * 100);
  //   if (queryParams.length === 2) {
  //     queryString += `WHERE cost_per_night >= $${queryParams.length - 1} AND cost_per_night <= $${queryParams.length}`;
  //   } else {
  //     queryString += `AND cost_per_night >= $${queryParams.length - 1} AND cost_per_night <= $${queryParams.length}`;
  //   }
  // }

  //4 Add any query that comes after the WHERE clause.

//   queryString += `GROUP BY properties.id`;

//   if (options.minimum_rating) {
//     queryParams.push(options.minimum_rating);
//     queryString += ` HAVING avg(property_reviews.rating) >= $${queryParams.length}`;
//   }

//   // 4
//   queryParams.push(limit);
//   queryString += `
//   ORDER BY cost_per_night
//   LIMIT $${queryParams.length};
//   `;

//   // 5 Console log everything just to make sure we've done it right.
//   console.log(queryString, queryParams);

//   // 6
//   return pool.query(queryString, queryParams)
//   .then(res => res.rows);
// };


// exports.getAllProperties = getAllProperties;


