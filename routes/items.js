const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  router.get('/new', (req, res) => {
    res.render('item_new', {userID:req.session.user_id});
  });

  // BROWSE - view homepage ==> GET /items
  router.get('/', (req, res) => {

    const userID = req.session.user_id;

    db.query(`SELECT * FROM items ORDER BY id DESC;`)
      .then(data => {
        const items = data.rows;
        console.log('the items are: ', items);
        res.render('items', {items, userID});
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  // READ - view specific item's page ==> GET /items/:id
  router.get('/:id', (req, res) => {

    db.query(`SELECT * FROM items WHERE id = $1`,[req.params.id])
      .then(data => {
        const item = data.rows[0];
        res.render('item_show', {item, userID:item.user_id});
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  // EDIT - admin edit data ==> POST /items/:id
  router.post('/:id', (req, res) => {

    const queryParams = [];

    let queryString = `UPDATE items SET `;

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
    queryString += `WHERE id = $${queryParams.length};`;

    db.query(queryString, queryParams)
      .then(data => {
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

    db.query(`INSERT INTO items (user_id, name, description, price, photo_url, sold)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`,
    [req.session.user_id, req.body['item name'], req.body.description, req.body.price, req.body.photo_url, req.body.sold])
      .then(data => {
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
        res.redirect('/items');
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  return router;
};
