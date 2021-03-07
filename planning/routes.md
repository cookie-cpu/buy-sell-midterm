### ROUTES

# RESTful

## ITEMS (HOME PAGE)

# BROWSE - view homepage
* GET /api/items

# READ - view specific item's page
* GET /api/items/:id

# EDIT - admin edit data 
* POST /api/items/:id

# ADD - admin add item
* POST /api/items

# DELETE - admin delete item
* POST /api/items/:id/delete

## USERS

# BROWSE - view all items listed by a specific user
* GET  /api/items/:user_id 

# READ - view specific item listed by a specific user
* GET  /api/items/:user_id/:id 

## MY FAVORITES

# BROWSE - view all favorite per user
<!-- GET /users/favorites -->
* GET /favorites/:user_id

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
