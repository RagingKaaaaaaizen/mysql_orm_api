require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyparser = require('body-parser');
const errorHandler = require('_middleware/error-handler');


app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(cors());

app.use('/users', require('./users/users.controller'));

app.use(errorHandler);

const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 3000;
app.listen(port, () => {
console.log('Server listening on port ' + port);
});
