const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  router.get('/new', (req, res) => {
    res.render('item_new')
  });

  // BROWSE - view all messages
  router.get('/', (req, res) => {
    db.query(`SELECT * FROM messages;`)
      .then(data => {
        console.log('the get / data is: ', data.rows)
        const messages = data.rows;
        res.render('messages', {messages});
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  // READ - view specific message
  router.get('/:id', (req, res) => {
    console.log('the get/:id req.params.id is:', req.params.id);
    db.query(`SELECT * FROM messages WHERE id = $1`,[req.params.id])
      .then(data => {
        console.log('the get /:id data is: ', data.rows[0])
        const message = data.rows[0];
        res.render('message', {message});
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  // ADD - message
  router.post('/', (req, res) => {
    console.log('req.body is:', req.body)
    db.query(`INSERT INTO messages (sender_id, recipient_id, message)
     VALUES ($1, $2, $3) RETURNING *;`,
    [req.body.sender_id, req.body.recipient_id, req.body.message])
      .then(data => {
        console.log('the post / data is: ', data.rows[0])
        const message = data.rows[0];
        res.redirect('/messages');
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  return router;
};
