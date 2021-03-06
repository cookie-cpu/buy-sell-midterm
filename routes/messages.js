const express = require('express');
const router  = express.Router();
const moment = require('moment-timezone');

module.exports = (db) => {

  // BROWSE - view all messages from different users
  router.get('/', (req, res) => {
    db.query(`
    SELECT U1.name as recipient_name, subquery.recipient_id as recipient_id, M1.message as message
    from messages as M1
    inner join
      (select recipient_id, max(id) as msg_id
      from messages
      where sender_id = $1
      group by recipient_id) as subquery ON M1.id = subquery.msg_id
    inner join users as U1 ON U1.id = subquery.recipient_id;
    `, [req.session.user_id])
      .then(data => {
        const messages = data.rows;
        res.render('messages', {messages, userID:req.session.user_id});
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  // READ - view message history between two users
  router.get('/:id', (req, res) => {
    db.query(`
      SELECT users.name as name, timestamp, message, recipient_id
      FROM messages
      JOIN users ON users.id = recipient_id
      WHERE sender_id = $1
      AND recipient_id = $2
      ORDER BY timestamp;`
    ,[req.session.user_id, req.params.id])
      .then(data => {
        const messages = data.rows.map(message => {
          const timestamp = moment.tz(message.timestamp, 'America/Vancouver').format('YYYY-MM-DD hh:mm A');
          return { ...message, timestamp };
        });
        console.log('messages new: ', messages);
        let name = '';
        if (data.rows[0]) {
          name = data.rows[0].name;
        }
        res.render('message_show', {messages, userID:req.session.user_id, ownerID:req.params.id, name:name });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  // ADD - message
  router.post('/:id', (req, res) => {
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
