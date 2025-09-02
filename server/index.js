require('dotenv').config();
const express = require('express');
const router = require('./routes.js');

const app = express();

app.use(express.json());
app.use('/', router);
app.use(express.static(path.join(__dirname, "../loader")));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('Server is running on port', PORT);
});