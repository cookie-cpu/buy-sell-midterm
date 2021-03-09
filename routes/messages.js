const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  // BROWSE - view all messages
  router.get('/', (req, res) => {
    db.query(`
    SELECT *
    FROM messages
    WHERE sender_id = 2
    ORDER BY timestamp DESC;`) //sender_id is hardcoded. this needs to change to use cookies?
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
    db.query(`
      SELECT *
      FROM messages
      WHERE sender_id = 2
      AND recipient_id = $1
      ORDER BY timestamp DESC` //sender_id is hardcoded. this needs to change to use cookies?
      ,[req.params.id])
      .then(data => {
        console.log('the get /:id data is: ', data.rows[0])
        const messages = data.rows;
        res.render('message_show', {messages});
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  // ADD - message
  router.post('/', (req, res) => {
    // router.post('/:id', (req, res) => {   // tried change route to /:id but broke route. how to incorporate req.params.id?
    console.log('req.body is:', req.body)
    console.log('req.params.id is ', req.params.id)
    db.query(`
    INSERT INTO messages (message)
     VALUES ($1) RETURNING *;`,
    [req.body.message])  // req.body.sender_id, req.body.recipient_id, aren't being passed thru. removed for now. tried adding req.params.id, but didn't work
      .then(data => {
        console.log('the post / data is: ', data.rows[0])
        const message = data.rows[0];  // not being called. delete?
        res.redirect('/messages');
        // res.redirect('/messages/:id'); // change to messages/:id ? so it returns to the specific msg history
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  return router;
};
