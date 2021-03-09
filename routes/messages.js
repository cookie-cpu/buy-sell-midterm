const express = require('express');
const router  = express.Router();

module.exports = (db) => {


  // BROWSE - view all messages
  router.get('/', (req, res) => {
    db.query(`
    SELECT users.name as recipient_name, recipient_id, messages.message as message
    FROM messages
    JOIN users ON users.id = recipient_id
    WHERE sender_id = $1
    ORDER BY timestamp DESC;`, [req.session.user_id])
      .then(data => {
        console.log('the get / data is: ', data.rows)
        console.log('session', req.session.user_id)
        const messages = data.rows    //.filter(row => {});
        res.render('messages', {messages, userID:req.session.user_id});
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  // READ - view specific message
  router.get('/:id', (req, res) => {
    // console.log('the get/:id req.params.id is:', req.params.id);
    db.query(`
      SELECT *
      FROM messages
      WHERE sender_id = $1
      AND recipient_id = $2
      ORDER BY timestamp`
      ,[req.session.user_id, req.params.id])
      .then(data => {
        // console.log('the get /:id data is: ', data.rows[0])
        const messages = data.rows;
        res.render('message_show', {messages, userID:req.session.user_id});
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  // ADD - message
  router.post('/:id', (req, res) => {
    console.log('req.body.recipient is:', req.body.recipient_id)
    console.log('req.params.id is ', req.params.id)
    db.query(`
    INSERT INTO messages (sender_id, recipient_id, message)
     VALUES ($1, $2, $3) RETURNING *;`,
    [req.session.user_id, req.params.id, req.body.message])
      .then(data => {
        res.redirect(`/messages/${req.params.id}`);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  return router;
};
