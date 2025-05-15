Fix database error: It is necessary to create a table that combines the "new expenses" and "expenses" tables.

Apparently, the server.js file interprets only the first command. Therefore, it is necessary to create a single function that merges both transactions in the database.
