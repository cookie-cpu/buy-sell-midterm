const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  router.get('/new', (req, res) => {
    res.render('item_new')
  });

  // BROWSE - view all messages ==> GET /m
  router.get('/', (req, res) => {
    db.query(`SELECT * FROM items;`)
      .then(data => {
        console.log('the get / data is: ', data.rows)
        const items = data.rows;
        res.render('items', {items});
        //res.json({ items });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  // READ - view specific message ==> GET /messages/:id
  router.get('/:id', (req, res) => {
    console.log('the get/:id req.params.id is:', req.params.id);
    db.query(`SELECT * FROM items WHERE id = $1`,[req.params.id])
      .then(data => {
        console.log('the get /:id data is: ', data.rows[0])
        const item = data.rows[0];
        res.render('item_show', {item});  // make new  item.ejs . no for loop need.
        //res.json({ items });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  // ADD - message ==> POST /messages
  router.post('/', (req, res) => {
    console.log('req.body is:', req.body)
    db.query(`INSERT INTO items (name, description, price, photo_url, sold)
     VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
    [req.body['item name'], req.body.description, req.body.price, req.body.photo_url, req.body.sold])
      .then(data => {
        console.log('the post / data is: ', data.rows[0])
        const items = data.rows[0];
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
