### ROUTES

# RESTful

## ITEMS (HOME PAGE)

# BROWSE - view homepage
* GET /items

# READ - view specific item's page
* GET /items/:id

# EDIT - admin edit data 
* POST /items/:id

# ADD - admin add item
* POST /items

# DELETE - admin delete item
* POST /items/:id/delete

## USERS

# BROWSE - view all items listed by a specific user
* GET  /items/:user_id 

# READ - view specific item listed by a specific user
* GET  /items/:user_id/:id 

## MY FAVORITES

# BROWSE - view all favorite per user
* GET /favorites

# READ - view specific favorite
* GET /favorites/:id

# ADD - create fav connection
* POST /favorites

# DELETE - remove fav connection
* POST /favorites/:id/delete


## MY MESSAGES

# BROWSE - view all msgs
* GET /messages

# READ - view a specific msg
* GET /messages/:id

# ADD - reply to a msg
* POST /messages
