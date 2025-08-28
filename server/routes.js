const controller = require('./controller.js');
const router = require('express').Router();

router.get('/reviews', controller.getReviews);

module.exports = router;