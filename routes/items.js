// * All routes for items are defined here
/*
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();


// BROWSE - view homepage ==> GET /items

module.exports = (db) => {

  router.get('/new', (req, res) => {
    res.render('item_new', {userID:req.session.user_id});
  });

  router.get('/', (req, res) => {
    const userID = req.session.user_id
    db.query(`SELECT * FROM items;`)
      .then(data => {
        const items = data.rows;
        console.log('the items are: ', items)
        res.render('items', {items, userID});
        //res.json({ items });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
    });

// READ - view specific item's page ==> GET /items/:id

  router.get('/:id', (req, res) => {
    // console.log('the get/:id req.params.id is:', req.params.id);
    db.query(`SELECT * FROM items WHERE id = $1`,[req.params.id])
      .then(data => {
        // console.log('the get /:id data is: ', data.rows[0])
        const item = data.rows[0];
        res.render('item_show', {item, userID:item.user_id});  // make new  item.ejs . no for loop need.
        //res.json({ items });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
    });

// EDIT - admin edit data ==> POST /items/:id

// THIS IS THE EDIT BUTTON ROUTE
  router.post('/:id', (req, res) => {
    // console.log('the post/:id req.params.id is:', req.params.id);
    // console.log('req.body is:', req.body);
    // console.log('req.body.name is:', req.body['item name']);
    const queryParams = [];

    let queryString = `UPDATE items SET `;

    // if (req.body['user_id']) {
    //   queryParams.push(req.body['user_id']);
    //   queryString += `user_id = $${queryParams.length} `;
    // }

    if (req.body['item name']) {
      queryParams.push(req.body['item name']);
      queryString += `name = $${queryParams.length}, `;
    }

    if (req.body.description) {
      queryParams.push(req.body.description);
      queryString += `description = $${queryParams.length}, `;
    }

    if (req.body.price) {
      queryParams.push(req.body.price);
      queryString += `price = $${queryParams.length}, `;
    }

    if (req.body.photo_url) {
      queryParams.push(req.body.photo_url);
      queryString += `photo_url = $${queryParams.length}, `;
    }

    if (req.body.sold) {
      queryParams.push(req.body.sold);
      queryString += `sold = $${queryParams.length}, `;
    }

    queryString = queryString.slice(0, queryString.length - 2);

    queryParams.push(req.params.id);
    queryString += `WHERE id = $${queryParams.length};`
    console.log('querystring is:', queryString)
    db.query(queryString, queryParams)



    // db.query(`
    // UPDATE items SET
    // user_id = $1,
    // name = $2,
    // description = $3,
    // price = $4,
    // photo_url = $5,
    // sold = $6
    // WHERE id = $7;`
    // ,[req.body['user_id'], req.body['item name'], req.body.description, req.body.price, req.body.photo_url, req.body.sold, req.params.id])
      .then(data => {
        // console.log('the post /:id data is: ', data.rows[0])
        const items = data.rows[0];
        res.redirect('/items');
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  // ADD - admin add item  ==> POST /items

  router.post('/', (req, res) => {
    //console.log('req.body is:', req.body)
    //console.log("session is:", req.session.user_id);

    db.query(`INSERT INTO items (user_id, name, description, price, photo_url, sold)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`,
    [req.session.user_id, req.body['item name'], req.body.description, req.body.price, req.body.photo_url, req.body.sold])
      .then(data => {
        // console.log('the post / data is: ', data.rows[0])
        const items = data.rows[0];
        res.redirect('/items');
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

    // DELETE - admin delete item ===> POST /items/:id/delete

  router.post('/:id/delete', (req, res) => {
    db.query(`DELETE FROM items WHERE id = $1;`,[req.params.id])
      .then(data => {
        // console.log('the post / data is: ', data.rows[0])
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

  return router;
};
